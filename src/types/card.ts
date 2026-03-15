export interface ManholeCard {
    id: string; // e.g., "13-101-A001" or a custom internal ID
    prefecture: string; // "東京都"
    city: string; // "千代田区"
    edition: string; // "第1弾"
    imageUrl?: string;
    remoteImageUrl?: string;
}

export interface CollectionState {
    [cardId: string]: boolean; // true if collected
}
