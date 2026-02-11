import { ManholeCard } from "@/types/card";
import { CardItem } from "./CardItem";

interface CardListProps {
  cards: ManholeCard[];
  collectedIds: Set<string>;
  onToggleCollection: (id: string) => void;
}

export const CardList = ({ cards, collectedIds, onToggleCollection }: CardListProps) => {
  if (cards.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        該当するカードが見つかりません
      </div>
    );
  }

  return (
    <div className="grid-cards">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          isCollected={collectedIds.has(card.id)}
          onToggleCollection={onToggleCollection}
        />
      ))}
    </div>
  );
};
