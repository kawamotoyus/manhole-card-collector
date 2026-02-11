import { ManholeCard } from "@/types/card";

interface CardItemProps {
  card: ManholeCard;
  isCollected: boolean;
  onToggleCollection: (id: string) => void;
}

export const CardItem = ({ card, isCollected, onToggleCollection }: CardItemProps) => {
  return (
    <div className="card">
      <div className="card-image-wrapper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.imageUrl} alt={`${card.city}のマンホールカード`} className="card-image" />
      </div>
      <div className="card-content">
        <div className="card-header">
          <div>
            <div className="card-subtitle">{card.prefecture}</div>
            <div className="card-title">{card.city}</div>
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            padding: '0.2rem 0.5rem', 
            backgroundColor: '#333', 
            borderRadius: '4px' 
          }}>
            {card.round}
          </div>
        </div>
        
        <div className="card-details">
          <p>発行日: {card.publicationDate}</p>
          <p style={{ marginTop: '0.25rem', whiteSpace: 'pre-wrap' }}>
            配布場所: {card.distributionLocation}
          </p>
        </div>

        <button 
          className={`btn-collect ${isCollected ? 'collected' : ''}`}
          onClick={() => onToggleCollection(card.id)}
        >
          {isCollected ? '✨ 収集済み' : '未所持'}
        </button>
      </div>
    </div>
  );
};
