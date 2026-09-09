import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { 
  Sidebar 
} from './components/Sidebar';
import { 
  ChatView 
} from './components/ChatView';
import { 
  ConversationDetails 
} from './components/ConversationDetails';
import { 
  EmptyState 
} from './components/EmptyState';
import { 
  SupabaseSetupModal 
} from './components/SupabaseSetupModal';
import { 
  Conversation, 
  Message, 
  FilterStatus, 
  SortOption, 
  ConversationStatus 
} from './types';
import { 
  supabase, 
  isSupabaseConfigured, 
  getConversations, 
  getMessages, 
  updateConversationStatus as apiUpdateStatus,
  insertMessage 
} from './lib/supabase';
import { 
  Menu, 
  X, 
  Bell, 
  CheckCircle2, 
  Radio 
} from 'lucide-react';

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('updated');

  // UI Panels
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Realtime & Alerts
  const [isRealtimeActive, setIsRealtimeActive] = useState(isSupabaseConfigured);
  const [realtimeNotification, setRealtimeNotification] = useState<string | null>(null);

  // Load conversations
  const loadConversations = useCallback(async (selectFirst = false) => {
    setIsLoadingConversations(true);
    const { data } = await getConversations();
    setConversations(data);
    setIsLoadingConversations(false);

    if (selectFirst && data.length > 0) {
      setSelectedId(data[0].id);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadConversations(true);
  }, [loadConversations]);

  // Load messages whenever selected conversation changes
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }

    let isCurrent = true;
    setIsLoadingMessages(true);

    getMessages(selectedId).then(({ data }) => {
      if (isCurrent) {
        setMessages(data);
        setIsLoadingMessages(false);
      }
    });

    return () => {
      isCurrent = false;
    };
  }, [selectedId]);

  // Handle Supabase Realtime Subscription
  useEffect(() => {
    if (!supabase) {
      // In preview mode, realtime indicator is simulated as ready
      setIsRealtimeActive(true);
      return;
    }

    const channel = supabase
      .channel('realtime_support_admin')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new as any;
          if (!newMsg) return;

          const formattedMsg: Message = {
            id: String(newMsg.id),
            conversation_id: String(newMsg.conversation_id),
            sender_type: newMsg.sender_type === 'ai' ? 'ai' : 'customer',
            content: newMsg.content || '',
            created_at: newMsg.created_at || new Date().toISOString(),
            model_name: newMsg.model_name,
          };

          // If the message belongs to current active conversation, append it
          setSelectedId((currentSelected) => {
            if (currentSelected === formattedMsg.conversation_id) {
              setMessages((prev) => {
                // Prevent duplicate insertions
                if (prev.some((m) => m.id === formattedMsg.id)) return prev;
                return [...prev, formattedMsg];
              });
            }
            return currentSelected;
          });

          // Update sidebar conversation item with latest message and timestamp
          setConversations((prev) =>
            prev.map((conv) => {
              if (conv.id === formattedMsg.conversation_id) {
                return {
                  ...conv,
                  last_message: formattedMsg.content,
                  last_message_at: formattedMsg.created_at,
                  updated_at: formattedMsg.created_at,
                  unread: true,
                };
              }
              return conv;
            })
          );

          // Show realtime toast notice
          setRealtimeNotification(
            `New message received in chat #${formattedMsg.conversation_id.slice(-4)}`
          );
          setTimeout(() => setRealtimeNotification(null), 4000);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'conversations' },
        (payload) => {
          const updated = payload.new as any;
          if (!updated) return;

          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === String(updated.id)
                ? {
                    ...conv,
                    status: (updated.status as ConversationStatus) || conv.status,
                    last_message: updated.last_message || conv.last_message,
                    last_message_at: updated.last_message_at || conv.last_message_at,
                    updated_at: updated.updated_at || conv.updated_at,
                  }
                : conv
            )
          );
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeActive(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          setIsRealtimeActive(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update conversation status handler
  const handleUpdateStatus = async (newStatus: ConversationStatus) => {
    if (!selectedId) return;

    // Optimistic update
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, status: newStatus } : c))
    );

    // Call Supabase API
    await apiUpdateStatus(selectedId, newStatus);
  };

  // Simulate real-time message handler (works for testing both in local & live DB)
  const handleSimulateMessage = async (senderType: 'customer' | 'ai') => {
    if (!selectedId) return;

    const currentConv = conversations.find((c) => c.id === selectedId);
    if (!currentConv) return;

    const sampleCustomerReplies = [
      'That clarifies the PEMF protocol completely, thank you for checking!',
      'Could you confirm if the waterproof cover fits the 7224 model as well?',
      'Awesome, I just tested the controller reset and the temperature is heating up normally.',
      'Thank you for the quick warranty verification, appreciate the fast support turnaround!',
    ];

    const sampleAIReplies = [
      'You are very welcome! I have logged this ticket in your HealthyLine account history. Let us know if anything else comes up.',
      'Yes, the heavy-duty waterproof cover is custom-tailored for all 7224 Inframat Pro and Platinum models.',
      'Glad to hear the controller reset worked! Our system has marked this ticket as verified. Enjoy your wellness session!',
    ];

    const content =
      senderType === 'customer'
        ? sampleCustomerReplies[Math.floor(Math.random() * sampleCustomerReplies.length)]
        : sampleAIReplies[Math.floor(Math.random() * sampleAIReplies.length)];

    // Insert to DB or local fallback
    const { data: createdMsg } = await insertMessage(
      selectedId,
      senderType,
      content,
      'HealthyLine AI Support'
    );

    if (createdMsg) {
      setMessages((prev) => [...prev, createdMsg]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? {
                ...c,
                last_message: content,
                last_message_at: createdMsg.created_at,
                updated_at: createdMsg.created_at,
              }
            : c
        )
      );

      setRealtimeNotification(
        `Simulated Realtime ${senderType === 'customer' ? 'Customer' : 'AI'} message triggered!`
      );
      setTimeout(() => setRealtimeNotification(null), 3500);
    }
  };

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  return (
    <div id="ai-support-admin-app" className="flex h-screen w-screen bg-white text-zinc-900 overflow-hidden font-sans">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 md:static md:z-auto transition-transform duration-200 transform ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <Sidebar
          conversations={conversations}
          selectedId={selectedId}
          onSelectConversation={(id) => {
            setSelectedId(id);
            setIsMobileSidebarOpen(false);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          sortOption={sortOption}
          onSortChange={setSortOption}
          isLoading={isLoadingConversations}
          onRefresh={() => loadConversations(false)}
          isRealtimeActive={isRealtimeActive}
          isSupabaseConfigured={isSupabaseConfigured}
          onOpenSetupModal={() => setIsSetupModalOpen(true)}
        />
      </div>

      {/* Center Main Chat Panel */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-2 min-w-0">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <img
                src="https://cdn.shopify.com/s/files/1/0639/6172/7028/files/HealthyLine_logo_909e00d5-5467-4ce1-9ba0-4fc038a1f537.png?v=1735050048"
                alt="HealthyLine"
                referrerPolicy="no-referrer"
                className="h-5 w-auto object-contain flex-shrink-0"
              />
              <span className="font-semibold text-xs text-zinc-900 truncate">
                {selectedConversation ? selectedConversation.customer_name : 'HealthyLine Support'}
              </span>
            </div>
          </div>
          <button
            id="mobile-setup-btn"
            onClick={() => setIsSetupModalOpen(true)}
            className="text-[11px] px-2 py-1 bg-zinc-100 rounded text-zinc-700 font-medium flex-shrink-0"
          >
            Supabase
          </button>
        </div>

        {/* Realtime Notification Toast */}
        {realtimeNotification && (
          <div
            id="realtime-toast-alert"
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-4 py-2 rounded-full shadow-lg border border-zinc-700 text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{realtimeNotification}</span>
          </div>
        )}

        {/* Chat view or Empty state */}
        {selectedConversation ? (
          <div className="flex-1 flex h-full min-w-0">
            <ChatView
              conversation={selectedConversation}
              messages={messages}
              isLoadingMessages={isLoadingMessages}
              onUpdateStatus={handleUpdateStatus}
              onToggleDetails={() => setIsDetailsOpen(!isDetailsOpen)}
              isDetailsOpen={isDetailsOpen}
              onSimulateMessage={handleSimulateMessage}
              isSupabaseConnected={isSupabaseConfigured}
            />

            {/* Slide-out or pinned conversation metadata drawer */}
            {isDetailsOpen && (
              <ConversationDetails
                conversation={selectedConversation}
                onClose={() => setIsDetailsOpen(false)}
                onUpdateStatus={handleUpdateStatus}
                isSupabaseConnected={isSupabaseConfigured}
              />
            )}
          </div>
        ) : (
          <EmptyState
            totalConversations={conversations.length}
            openConversations={conversations.filter((c) => c.status === 'open').length}
            isRealtimeActive={isRealtimeActive}
            onSelectFirst={() => {
              if (conversations.length > 0) setSelectedId(conversations[0].id);
            }}
          />
        )}
      </div>

      {/* Supabase Connection Setup & SQL Modal */}
      <SupabaseSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        isConfigured={isSupabaseConfigured}
        onRefreshData={() => loadConversations(false)}
      />
    </div>
  );
}
