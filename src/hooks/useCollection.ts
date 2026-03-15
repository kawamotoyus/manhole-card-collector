import { useState, useEffect } from 'react';
import { CollectionState } from '../types/Card';

const STORAGE_KEY = 'manhole_card_collection';

export function useCollection() {
    const [collection, setCollection] = useState<CollectionState>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
    }, [collection]);

    const toggleCollection = (cardId: string) => {
        setCollection(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    const isCollected = (cardId: string) => {
        return !!collection[cardId];
    };

    return { collection, toggleCollection, isCollected };
}
