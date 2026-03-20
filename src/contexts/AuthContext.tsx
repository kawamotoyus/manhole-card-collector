/**
 * 認証コンテキスト（AuthContext）
 * Googleログイン/ログアウト機能と、現在のユーザー状態をアプリ全体に提供する
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebaseConfig';

/** 認証コンテキストの型定義 */
interface AuthContextType {
  /** 現在ログイン中のユーザー（未ログインならnull） */
  user: User | null;
  /** 認証状態の読み込み中かどうか */
  loading: boolean;
  /** Googleアカウントでログイン */
  signInWithGoogle: () => Promise<void>;
  /** ログアウト */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 認証プロバイダーコンポーネント
 * アプリのルートで使用し、子コンポーネントに認証状態を提供する
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Firebase Authの状態変化を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (error) => {
      console.error("[AuthContext] onAuthStateChanged error:", error);
      setLoading(false);
    });

    // クリーンアップ：リスナーの解除
    return () => unsubscribe();
  }, []);

  /** Googleアカウントでサインイン */
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Googleログインに失敗しました:', error);
      throw error;
    }
  };

  /** サインアウト */
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 認証コンテキストを使用するカスタムフック
 * AuthProvider配下でのみ使用可能
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthはAuthProvider内で使用してください');
  }
  return context;
};
