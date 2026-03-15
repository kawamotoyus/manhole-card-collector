/**
 * コレクション管理フック
 *
 * ログイン時: Firestoreの users/{uid}/collection ドキュメントに読み書き
 * 未ログイン時: localStorageにフォールバック
 * ログイン直後: localStorageの既存データをFirestoreへマイグレーション
 */
import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { CollectionState } from '../types/card';

const STORAGE_KEY = 'manhole_card_collection';

/**
 * localStorageからコレクション状態を読み込む
 */
function loadFromLocalStorage(): CollectionState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * localStorageにコレクション状態を保存する
 */
function saveToLocalStorage(collection: CollectionState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

export function useCollection() {
  const { user } = useAuth();
  const [collection, setCollection] = useState<CollectionState>(loadFromLocalStorage);
  const [isLoading, setIsLoading] = useState(false);

  // -----------------------------------------------------------------------
  // Firestoreのリアルタイムリスナー（ログイン時）
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!user) {
      // 未ログイン: localStorageから読み込み
      setCollection(loadFromLocalStorage());
      return;
    }

    setIsLoading(true);
    const docRef = doc(db, 'users', user.uid, 'data', 'collection');

    // ログイン直後: localStorageのデータをFirestoreへマイグレーション
    const migrateLocalData = async () => {
      const localData = loadFromLocalStorage();
      const localHasData = Object.values(localData).some(Boolean);

      if (localHasData) {
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) {
          // Firestoreにデータがない場合のみマイグレーション
          await setDoc(docRef, { cards: localData });
        } else {
          // Firestoreに既にデータがある場合はマージ
          const remoteData = snapshot.data()?.cards || {};
          const mergedData = { ...localData, ...remoteData };
          await setDoc(docRef, { cards: mergedData });
        }
        // マイグレーション完了後、localStorageをクリア
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    migrateLocalData().catch(console.error);

    // Firestoreのリアルタイムリスナーを設定
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setCollection(snapshot.data()?.cards || {});
        } else {
          setCollection({});
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Firestore同期エラー:', error);
        // エラー時はlocalStorageにフォールバック
        setCollection(loadFromLocalStorage());
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // -----------------------------------------------------------------------
  // 未ログイン時: collectionの変更をlocalStorageに自動保存
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!user) {
      saveToLocalStorage(collection);
    }
  }, [collection, user]);

  // -----------------------------------------------------------------------
  // コレクションの切り替え
  // -----------------------------------------------------------------------
  const toggleCollection = useCallback(
    async (cardId: string) => {
      const newValue = !collection[cardId];
      const newCollection = { ...collection, [cardId]: newValue };

      // 楽観的更新（UIを即座に反映）
      setCollection(newCollection);

      if (user) {
        // Firestoreに保存
        try {
          const docRef = doc(db, 'users', user.uid, 'data', 'collection');
          await setDoc(docRef, { cards: newCollection });
        } catch (error) {
          console.error('Firestoreへの保存に失敗しました:', error);
          // 失敗時はロールバック
          setCollection(collection);
        }
      }
    },
    [collection, user]
  );

  const isCollected = useCallback(
    (cardId: string) => !!collection[cardId],
    [collection]
  );

  return { collection, toggleCollection, isCollected, isLoading };
}
