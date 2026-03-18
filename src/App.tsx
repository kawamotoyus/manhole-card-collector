import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollection } from './hooks/useCollection';
import scrapedCards from './data/scraped_cards.json';
import { CardItem } from './components/CardItem';
import LoginPage from './components/LoginPage';
import UserMenu from './components/UserMenu';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MapPin, LayoutGrid, CheckCircle2, CircleDashed, Search, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const SAMPLE_CARDS = scrapedCards;

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

/**
 * メインアプリコンテンツ（認証済みユーザー向け）
 */
const AppContent: React.FC = () => {
    const { collection, toggleCollection } = useCollection();
    const [filter, setFilter] = useState<'all' | 'collected' | 'uncollected'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const collectedCount = Object.values(collection).filter(Boolean).length;
    const totalCount = SAMPLE_CARDS.length;

    const filteredCards = useMemo(() => {
        return SAMPLE_CARDS.filter(card => {
            const isCollected = !!collection[card.id];
            const matchesFilter = filter === 'all'
                ? true
                : filter === 'collected'
                    ? isCollected
                    : !isCollected;

            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                card.prefecture.toLowerCase().includes(searchLower) ||
                card.city.toLowerCase().includes(searchLower) ||
                card.edition.toLowerCase().includes(searchLower);

            return matchesFilter && matchesSearch;
        });
    }, [collection, filter, searchQuery]);

    return (
        <div className="min-h-screen bg-[#111116] text-white selection:bg-blue-500/30">
            {/* Background ambient glow */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20">

                {/* Header Section */}
                <header className="mb-12 text-center md:text-left md:flex md:items-end md:justify-between">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-300"
                        >
                            <MapPin size={14} />
                            <span>Japan Manhole Cards</span>
                            {/* ユーザーメニュー（プロフィール画像 + ログアウト） */}
                            <UserMenu />
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60"
                        >
                            Card Collector
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/50 text-lg max-w-xl"
                        >
                            マンホールカードのコレクションを管理しましょう。美しいご当地デザインの数々をここに。
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 md:mt-0 flex flex-col items-center md:items-end"
                    >
                        <div className="text-sm text-white/50 mb-2 uppercase tracking-wider font-semibold">
                            Completion
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">{collectedCount}</span>
                            <span className="text-xl text-white/40">/ {totalCount}</span>
                        </div>
                        <div className="w-48 h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.round((collectedCount / totalCount) * 100)}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                            />
                        </div>
                    </motion.div>
                </header>

                {/* Controls Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
                >
                    {/* Search Bar */}
                    <div className="relative w-full md:w-auto md:flex-1 max-w-md px-2">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-white/40" />
                        </div>
                        <input
                            type="text"
                            placeholder="都道府県、市区町村、弾数で検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex p-1 bg-black/20 rounded-xl w-full md:w-auto overflow-x-auto hide-scrollbar">
                        {[
                            { id: 'all', label: 'All', icon: LayoutGrid },
                            { id: 'collected', label: 'Collected', icon: CheckCircle2 },
                            { id: 'uncollected', label: 'Missing', icon: CircleDashed },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = filter === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilter(tab.id as any)}
                                    className={cn(
                                        "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                                        isActive
                                            ? "bg-white/10 text-white shadow-lg border border-white/10"
                                            : "text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent"
                                    )}
                                >
                                    <Icon size={16} className={isActive ? "text-blue-400" : ""} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Grid Section */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredCards.map((card) => (
                            <CardItem
                                key={card.id}
                                card={card}
                                isCollected={!!collection[card.id]}
                                onToggle={toggleCollection}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredCards.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-panel rounded-3xl p-16 text-center shadow-xl mt-8"
                    >
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                            <MapPin className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">該当するカードがありません</h3>
                        <p className="text-slate-400">検索条件を変更するか、フィルター設定を確認してください。</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

/**
 * ルートAppコンポーネント
 * AuthProviderで全体をラップし、認証状態に応じてLoginPageかAppContentを表示
 */
const App: React.FC = () => {
    return (
        <AuthProvider>
            <AuthGate />
        </AuthProvider>
    );
};

/**
 * 認証ゲートコンポーネント
 * ログイン状態に応じて表示を切り替える
 */
const AuthGate: React.FC = () => {
    const { user, loading } = useAuth();
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (loading) {
            const timer = setTimeout(() => {
                console.error("[AuthGate] Auth loading timed out after 10s");
                setTimedOut(true);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [loading]);

    // 認証状態の読み込み中
    if (loading) {
        return (
            <div className="min-h-screen bg-[#111116] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                {timedOut && (
                    <div className="text-white/60 text-sm animate-pulse">
                        初期化に時間がかかっています。ネットワーク設定やFirebase設定を確認してください。
                    </div>
                )}
            </div>
        );
    }

    // 未ログイン → ログイン画面を表示
    if (!user) {
        return <LoginPage />;
    }

    // ログイン済み → メインコンテンツ
    return <AppContent />;
};

export default App;
