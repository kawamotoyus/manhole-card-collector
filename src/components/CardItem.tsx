import React from 'react';
import { motion } from 'framer-motion';
import { ManholeCard } from '../types/Card';
import { Check, Plus, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface Props {
    card: ManholeCard;
    isCollected: boolean;
    onToggle: (id: string) => void;
}

export const CardItem: React.FC<Props> = ({ card, isCollected, onToggle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={twMerge(
                clsx(
                    "glass-panel relative flex flex-col justify-between overflow-hidden rounded-2xl transition-all duration-300",
                    isCollected
                        ? "border-brand-500/50 bg-brand-900/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                        : "hover:border-white/20 hover:bg-slate-800/80"
                )
            )}
        >
            {/* Background glow for collected state */}
            {isCollected && (
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-brand-500/20 blur-3xl z-0 pointer-events-none" />
            )}

            {/* Image Cover Section */}
            <div className="relative h-48 w-full bg-slate-800/50 flex items-center justify-center z-10 overflow-hidden border-b border-white/5">
                {(card.remoteImageUrl || card.imageUrl) ? (
                    <img
                        src={card.remoteImageUrl || card.imageUrl}
                        alt={`${card.prefecture} ${card.city} Manhole Card`}
                        className="w-full h-full object-cover opacity-90 transition-opacity duration-300 hover:opacity-100"
                    />
                ) : (
                    <div className="text-slate-500 flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8 opacity-50" />
                        <span className="text-sm font-medium tracking-wider uppercase opacity-50">No Image</span>
                    </div>
                )}

                <div className="absolute top-3 right-3 z-20">
                    <span className="inline-flex rounded-full bg-black/50 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-md border border-white/10 shadow-sm">
                        {card.edition}
                    </span>
                </div>
            </div>

            <div className="p-6 relative z-10 flex flex-col flex-grow">
                <div className="mb-4">
                    <p className="text-xs uppercase tracking-widest text-brand-400 font-bold mb-1">
                        {card.prefecture}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight text-white m-0 leading-tight">
                        {card.city}
                    </h3>
                    <p className="text-sm font-mono text-slate-400 mt-2 opacity-70">
                        ID: {card.id}
                    </p>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-end border-t border-white/5">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onToggle(card.id)}
                        className={twMerge(
                            clsx(
                                "flex items-center w-full justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 shadow-lg",
                                isCollected
                                    ? "bg-brand-500 text-white hover:bg-brand-600 shadow-brand-500/20"
                                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
                            )
                        )}
                    >
                        {isCollected ? (
                            <>
                                <Check className="h-4 w-4" />
                                <span>取得済み</span>
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                <span>コレクションに追加</span>
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};
