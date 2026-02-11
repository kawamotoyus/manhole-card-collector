"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { CardList } from "@/components/CardList";
import { sampleCards } from "@/data/sampleCards";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [collectedIds, setCollectedIds] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);

  // Load collected status from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("collectedCards");
    if (saved) {
      try {
        setCollectedIds(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to parse collected cards", e);
      }
    }
    setIsClient(true);
  }, []);

  // Save collected status to LocalStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("collectedCards", JSON.stringify(Array.from(collectedIds)));
    }
  }, [collectedIds, isClient]);

  const toggleCollection = (id: string) => {
    setCollectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredCards = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return sampleCards.filter(
      (card) =>
        card.prefecture.includes(searchQuery) ||
        card.city.includes(searchQuery) ||
        card.prefecture.toLowerCase().includes(lowerQuery) ||
        card.city.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const collectionRate = Math.round((collectedIds.size / sampleCards.length) * 100);

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <>
      <Header />
      <main className="container" style={{ paddingBottom: '4rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <p style={{ color: 'var(--text-muted)' }}>
              全{sampleCards.length}種中、現在{filteredCards.length}種を表示中
            </p>
          </div>
          <div style={{ 
            backgroundColor: '#262626', 
            padding: '0.5rem 1rem', 
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            fontSize: '0.9rem'
          }}>
            収集率: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{collectionRate}%</span> ({collectedIds.size}/{sampleCards.length})
          </div>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        <div style={{ marginBottom: "2rem" }}>
           <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "var(--foreground)" }}>
             配布場所マップ
           </h2>
           <MapView cards={filteredCards} />
        </div>

        <CardList 
          cards={filteredCards} 
          collectedIds={collectedIds} 
          onToggleCollection={toggleCollection} 
        />
      </main>
    </>
  );
}
