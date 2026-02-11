"use client";

import { useState, useRef, useMemo } from "react";
import { Header } from "@/components/Header";
import Link from "next/link";
import { sampleCards } from "@/data/sampleCards";

export default function SettingsPage() {
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = localStorage.getItem("collectedCards");
      const blob = new Blob([data || "[]"], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `manhole-cards-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage("✅ データのエクスポートが完了しました");
    } catch (e) {
      console.error(e);
      setMessage("❌ エクスポートに失敗しました");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const parsed = JSON.parse(json);
        if (!Array.isArray(parsed)) throw new Error("Invalid format");
        
        // Basic validation: check if items are strings
        if (parsed.length > 0 && typeof parsed[0] !== "string") throw new Error("Invalid data type");

        localStorage.setItem("collectedCards", JSON.stringify(parsed));
        setMessage("✅ データのインポート（復元）が完了しました！");
        setTimeout(() => window.location.reload(), 1500);
      } catch (e) {
        console.error(e);
        setMessage("❌ ファイル形式が正しくありません");
      }
    };
    reader.readAsText(file);
  };

  // Calculate Statistics
  const statistics = useMemo(() => {
    if (typeof window === "undefined") return [];

    const collectedSet = new Set(JSON.parse(localStorage.getItem("collectedCards") || "[]"));
    const statsMap = new Map<string, { total: number; collected: number }>();

    sampleCards.forEach(card => {
      const current = statsMap.get(card.prefecture) || { total: 0, collected: 0 };
      statsMap.set(card.prefecture, {
        total: current.total + 1,
        collected: current.collected + (collectedSet.has(card.id) ? 1 : 0)
      });
    });

    return Array.from(statsMap.entries()).map(([pref, data]) => ({
      pref,
      ...data,
      percentage: Math.round((data.collected / data.total) * 100)
    })).sort((a, b) => b.percentage - a.percentage); // Sort by completion rate
  }, []);

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

        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>設定 / データ管理</h1>

        {message && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#262626', 
            borderRadius: '8px', 
            marginBottom: '2rem',
            border: '1px solid var(--card-border)'
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gap: '2rem', maxWidth: '600px' }}>

          {/* Statistics Section */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>📊 収集状況 (都道府県別)</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {statistics.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>データ読み込み中...</p>
              ) : (
                statistics.map((stat) => (
                  <div key={stat.pref} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '80px', fontWeight: 'bold' }}>{stat.pref}</div>
                    <div style={{ flex: 1, height: '10px', backgroundColor: '#333', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${stat.percentage}%`, 
                        backgroundColor: stat.percentage === 100 ? '#22c55e' : 'var(--primary)',
                        transition: 'width 0.5s ease-out'
                      }} />
                    </div>
                    <div style={{ width: '80px', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {stat.collected} / {stat.total} ({stat.percentage}%)
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Export Section */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>📦 データのバックアップ</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              現在の収集状況（「収集済み」のカードリスト）をJSONファイルとしてダウンロードします。
              機種変更時や、誤ってデータを消してしまった場合のバックアップとしてご利用ください。
            </p>
            <button 
              onClick={handleExport}
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              データをエクスポート (ダウンロード)
            </button>
          </div>

          {/* Import Section */}
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>🔄 データの復元 (インポート)</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              以前にエクスポートしたJSONファイルを読み込み、収集状況を復元します。
              <br/>
              <strong style={{ color: '#ef4444' }}>注意: 現在のデータは上書きされます。</strong>
            </p>
            
            <input 
              type="file" 
              accept=".json"
              ref={fileInputRef}
              onChange={handleImport}
              style={{ display: 'none' }}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: '#333',
                color: 'var(--foreground)',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ファイルを選択して復元...
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
