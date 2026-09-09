import React from 'react';
import { 
  Search, 
  X, 
  RefreshCw, 
  Radio, 
  SlidersHorizontal,
  ChevronDown,
  Database,
  Sparkles
} from 'lucide-react';
import { Conversation, FilterStatus, SortOption } from '../types';
import { formatRelativeTime, getInitials, getAvatarColor, getStatusBadge } from '../lib/formatters';

interface SidebarProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  isLoading: boolean;
  onRefresh: () => void;
  isRealtimeActive: boolean;
  isSupabaseConfigured: boolean;
  onOpenSetupModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  selectedId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortOption,
  onSortChange,
  isLoading,
  onRefresh,
  isRealtimeActive,
  isSupabaseConfigured,
  onOpenSetupModal,
}) => {
  // Compute counts
  const counts = {
    all: conversations.length,
    open: conversations.filter((c) => c.status === 'open').length,
    pending: conversations.filter((c) => c.status === 'pending').length,
    resolved: conversations.filter((c) => c.status === 'resolved').length,
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    // Status filter
    if (filterStatus !== 'all' && c.status !== filterStatus) {
      return false;
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.customer_name.toLowerCase().includes(q);
      const matchEmail = c.customer_email.toLowerCase().includes(q);
      const matchMsg = (c.last_message || '').toLowerCase().includes(q);
      const matchCategory = (c.category || '').toLowerCase().includes(q);
      const matchTags = c.tags?.some((t) => t.toLowerCase().includes(q));
      return matchName || matchEmail || matchMsg || matchCategory || matchTags;
    }

    return true;
  });

  // Sort conversations
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortOption === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    // 'updated'
    const timeA = new Date(a.last_message_at || a.updated_at || a.created_at).getTime();
    const timeB = new Date(b.last_message_at || b.updated_at || b.created_at).getTime();
    return timeB - timeA;
  });

  return (
    <aside 
      id="admin-sidebar" 
      className="w-full md:w-96 lg:w-[410px] flex-shrink-0 flex flex-col h-full bg-white border-r border-zinc-200 select-none"
    >
      {/* Top Header */}
      <div className="p-4 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-10 px-2.5 py-1 rounded-lg bg-white border border-zinc-200/90 flex items-center justify-center shadow-2xs flex-shrink-0">
              <img
                id="healthyline-brand-logo"
                src="https://cdn.shopify.com/s/files/1/0639/6172/7028/files/HealthyLine_logo_909e00d5-5467-4ce1-9ba0-4fc038a1f537.png?v=1735050048"
                alt="HealthyLine Logo"
                referrerPolicy="no-referrer"
                className="h-6 w-auto object-contain max-w-[110px]"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-sm text-zinc-900 leading-tight tracking-tight truncate">
                  HealthyLine
                </h1>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex-shrink-0">
                  Support
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 truncate">
                Customer Chat History Viewer
              </p>
            </div>
          </div>

          {/* Database / Realtime Status Indicator */}
          <button
            id="supabase-status-btn"
            onClick={onOpenSetupModal}
            title={
              isSupabaseConfigured
                ? 'Connected to Supabase (Click for connection details)'
                : 'Preview mode (Click to connect your Supabase database)'
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
              isSupabaseConfigured
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            {isSupabaseConfigured ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Supabase</span>
              </>
            ) : (
              <>
                <Database className="w-3 h-3 text-zinc-500" />
                <span>Supabase Setup</span>
              </>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="sidebar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search customer, email, keywords..."
            className="w-full pl-9 pr-8 py-2 bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white text-xs text-zinc-900 placeholder:text-zinc-400 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-all"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 mt-3 bg-zinc-100/80 p-0.5 rounded-lg text-xs">
          {(['all', 'open', 'pending', 'resolved'] as FilterStatus[]).map((tab) => {
            const count = counts[tab];
            const isActive = filterStatus === tab;
            return (
              <button
                key={tab}
                id={`filter-tab-${tab}`}
                onClick={() => onFilterChange(tab)}
                className={`flex-1 py-1.5 px-2 rounded-md font-medium capitalize text-center transition-all flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-zinc-100 text-zinc-800 font-semibold'
                      : 'text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List Header / Sort & Controls */}
      <div className="px-4 py-2 border-b border-zinc-100 flex items-center justify-between text-xs text-zinc-500 bg-zinc-50/50">
        <span className="font-medium text-zinc-600">
          {sortedConversations.length} {sortedConversations.length === 1 ? 'chat' : 'chats'}
          {searchQuery && ' found'}
        </span>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <SlidersHorizontal className="w-3 h-3 mr-1 text-zinc-400" />
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-xs text-zinc-600 hover:text-zinc-900 font-medium cursor-pointer focus:outline-none pr-3"
            >
              <option value="updated">Recent Activity</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <button
            id="refresh-conversations-btn"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh conversations list"
            className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/50 rounded transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Conversation List Scroll Area */}
      <div id="conversations-scroll-container" className="flex-1 overflow-y-auto divide-y divide-zinc-100">
        {sortedConversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-xs font-medium text-zinc-600 mb-1">No chats match this filter</p>
            <p className="text-[11px] text-zinc-400 mb-4">
              Try adjusting your search terms or filter selection.
            </p>
            {(searchQuery || filterStatus !== 'all') && (
              <button
                id="reset-filter-btn"
                onClick={() => {
                  onSearchChange('');
                  onFilterChange('all');
                }}
                className="inline-flex items-center px-3 py-1.5 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-50 shadow-xs"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          sortedConversations.map((chat) => {
            const isSelected = chat.id === selectedId;
            const badge = getStatusBadge(chat.status);
            const avatarColor = getAvatarColor(chat.customer_name);
            const initials = getInitials(chat.customer_name);
            const formattedTime = formatRelativeTime(chat.last_message_at || chat.updated_at);

            return (
              <button
                key={chat.id}
                id={`conversation-item-${chat.id}`}
                onClick={() => onSelectConversation(chat.id)}
                className={`w-full text-left p-3.5 transition-all flex items-start gap-3 relative ${
                  isSelected
                    ? 'bg-zinc-100/90 hover:bg-zinc-100 border-l-[3px] border-l-zinc-900 pl-3'
                    : 'bg-white hover:bg-zinc-50/80 border-l-[3px] border-l-transparent'
                }`}
              >
                {/* Avatar with Initials */}
                <div
                  className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-semibold text-xs border ${avatarColor.bg} ${avatarColor.text} ${avatarColor.border}`}
                >
                  {initials}
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  {/* Row 1: Name and Time */}
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-semibold text-xs text-zinc-900 truncate">
                      {chat.customer_name}
                    </span>
                    <span className="text-[10px] text-zinc-400 flex-shrink-0 font-medium">
                      {formattedTime}
                    </span>
                  </div>

                  {/* Row 2: Customer Email */}
                  <div className="text-[11px] text-zinc-500 truncate mb-1.5 font-normal">
                    {chat.customer_email}
                  </div>

                  {/* Row 3: Last Message snippet */}
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed font-normal mb-2">
                    {chat.last_message || 'No messages yet'}
                  </p>

                  {/* Row 4: Status Badge and Category */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${badge.classes}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
                      {badge.label}
                    </span>

                    {chat.category && (
                      <span className="text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200/60 truncate max-w-[130px]">
                        {chat.category}
                      </span>
                    )}

                    {chat.unread && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-blue-600" title="Unread" />
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-zinc-200/80 bg-zinc-50/80 text-[11px] text-zinc-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Radio
            className={`w-3.5 h-3.5 ${
              isRealtimeActive ? 'text-emerald-600 animate-pulse' : 'text-zinc-400'
            }`}
          />
          <span>{isRealtimeActive ? 'Realtime sync active' : 'Polling mode'}</span>
        </div>
        <span className="text-zinc-400">
          Supabase v2
        </span>
      </div>
    </aside>
  );
};
