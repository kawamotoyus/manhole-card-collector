"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { sampleCards } from "@/data/sampleCards";
import { Header } from "@/components/Header";

export default function CardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isCollected, setIsCollected] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Find the card
  const cardId = Array.isArray(params.id) ? params.id[0] : params.id;
  const decodedId = decodeURIComponent(cardId || "");
  const card = sampleCards.find((c) => c.id === decodedId);

  useEffect(() => {
    setIsClient(true);
    if (!card) return;

    // Load initial status
    const saved = localStorage.getItem("collectedCards");
    if (saved) {
      try {
        const collectedSet = new Set(JSON.parse(saved));
        setIsCollected(collectedSet.has(card.id));
      } catch (e) {
        console.error(e);
      }
    }
  }, [card]);

  const toggleCollection = () => {
    if (!card) return;
    
    setIsCollected((prev) => {
      const newState = !prev;
      
      // Update localStorage
      const saved = localStorage.getItem("collectedCards");
      let collectedSet = new Set<string>();
      try {
        if (saved) {
          collectedSet = new Set(JSON.parse(saved));
        }
      } catch (e) { console.error(e) }

      if (newState) {
        collectedSet.add(card.id);
      } else {
        collectedSet.delete(card.id);
      }
      localStorage.setItem("collectedCards", JSON.stringify(Array.from(collectedSet)));
      
      return newState;
    });
  };

  if (!card) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <p>カードが見つかりません。</p>
        <Link href="/" style={{ color: 'var(--primary)', marginTop: '1rem', display: 'inline-block' }}>topへ戻る</Link>
      </div>
    );
  }

  if (!isClient) return null;

  return (
    <>
      <Header />
      <main className="container" style={{ paddingBottom: '4rem' }}>
        <Link href="/" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          marginBottom: '2rem',
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          ← 一覧に戻る
        </Link>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', 
          gap: '3rem',
          alignItems: 'start'
        }}>
          {/* Left Column: Image */}
          <div style={{ 
            borderRadius: '12px', 
            overflow: 'hidden', 
            border: '1px solid var(--card-border)',
            backgroundColor: 'var(--card-bg)'
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={card.imageUrl} 
              alt={`${card.city}のマンホールカード`} 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
            />
          </div>

          {/* Right Column: Details */}
          <div>
            <div style={{ 
              display: 'inline-block', 
              backgroundColor: '#333', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px', 
              fontSize: '0.85rem',
              marginBottom: '1rem' 
            }}>
              {card.round}
            </div>
            
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', lineHeight: '1.2' }}>
              {card.city}
            </h1>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
              {card.prefecture}
            </h2>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem',
              backgroundColor: 'var(--card-bg)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid var(--card-border)'
            }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>配布場所</h3>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{card.distributionLocation}</p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>配布時間</h3>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{card.distributionTime}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>発行日</h3>
                  <p>{card.publicationDate}</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>ID</h3>
                  <p>{card.id}</p>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>座標</h3>
                <p style={{ fontFamily: 'monospace' }}>{card.coordinates}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(card.coordinates)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary)', fontSize: '0.9rem', display: 'inline-block', marginTop: '0.5rem' }}
                >
                  Google Mapsで見る ↗
                </a>
              </div>
            </div>

            <button 
              className={`btn-collect ${isCollected ? 'collected' : ''}`}
              onClick={toggleCollection}
              style={{ padding: '1rem', marginTop: '2rem', fontSize: '1.1rem' }}
            >
              {isCollected ? '✨ 収集済み' : '未所持のカードです'}
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Responsive Styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          main > div {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </>
  );
}
