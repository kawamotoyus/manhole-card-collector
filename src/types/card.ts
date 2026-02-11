export interface ManholeCard {
  id: string;
  prefecture: string;
  city: string;
  round: string;
  coordinates: string; // e.g. "35°41'22.1\"N 139°41'30.2\"E"
  imageUrl: string;
  distributionLocation: string;
  distributionTime: string;
  publicationDate: string;
  isCollected?: boolean; // Local state for collection
}
