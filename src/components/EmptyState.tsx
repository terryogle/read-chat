import React from 'react';
import { MessageSquare, ShieldCheck, Sparkles, Filter, Radio } from 'lucide-react';

interface EmptyStateProps {
  totalConversations: number;
  openConversations: number;
  isRealtimeActive: boolean;
  onSelectFirst?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  totalConversations,
  openConversations,
  isRealtimeActive,
  onSelectFirst,
}) => {
  return (
    <div 
      id="no-conversation-selected-state" 
      className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-50/40 text-center h-full select-none"
    >
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-zinc-200 shadow-xs">
        <div className="h-14 px-4 py-2 rounded-xl bg-white border border-zinc-200/90 flex items-center justify-center mx-auto mb-4 shadow-2xs w-fit">
          <img
            id="empty-state-healthyline-logo"
            src="https://cdn.shopify.com/s/files/1/0639/6172/7028/files/HealthyLine_logo_909e00d5-5467-4ce1-9ba0-4fc038a1f537.png?v=1735050048"
            alt="HealthyLine Logo"
            referrerPolicy="no-referrer"
            className="h-8 w-auto object-contain max-w-[140px]"
          />
        </div>

        <h3 className="text-base font-semibold text-zinc-900 mb-1.5">
          HealthyLine Support Chat History
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed mb-6">
          Choose any customer conversation from the left sidebar to inspect full message logs, AI responses, timestamps, and customer details.
        </p>

        {/* Quick summary cards */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] text-zinc-500 block">Total Conversations</span>
            <span className="text-lg font-bold text-zinc-900">{totalConversations}</span>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <span className="text-[11px] text-zinc-500 block">Needs Attention</span>
            <span className="text-lg font-bold text-blue-600">{openConversations} Open</span>
          </div>
        </div>

        {onSelectFirst && totalConversations > 0 && (
          <button
            id="open-first-chat-btn"
            onClick={onSelectFirst}
            className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            Open Most Recent Chat
          </button>
        )}

        <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-center gap-2 text-[11px] text-zinc-400">
          <Radio className={`w-3 h-3 ${isRealtimeActive ? 'text-emerald-500' : 'text-zinc-300'}`} />
          <span>Realtime Supabase streaming enabled</span>
        </div>
      </div>
    </div>
  );
};
