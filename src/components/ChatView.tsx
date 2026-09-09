import React, { useRef, useEffect, useState } from 'react';
import { ArrowDown, MessageSquareOff, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { Conversation, Message, ConversationStatus } from '../types';
import { ChatHeader } from './ChatHeader';
import { ChatMessageItem } from './ChatMessageItem';

interface ChatViewProps {
  conversation: Conversation;
  messages: Message[];
  isLoadingMessages: boolean;
  onUpdateStatus: (status: ConversationStatus) => void;
  onToggleDetails: () => void;
  isDetailsOpen: boolean;
  onSimulateMessage: (sender: 'customer' | 'ai') => void;
  isSupabaseConnected: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversation,
  messages,
  isLoadingMessages,
  onUpdateStatus,
  onToggleDetails,
  isDetailsOpen,
  onSimulateMessage,
  isSupabaseConnected,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [copiedTranscript, setCopiedTranscript] = useState(false);

  // Auto-scroll to bottom on message updates
  const scrollToBottom = (smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [conversation.id]);

  useEffect(() => {
    // When messages change, scroll to bottom if user is close to bottom
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 250;
      if (isNearBottom) {
        scrollToBottom(true);
      }
    }
  }, [messages.length]);

  // Handle scroll detection for "jump to bottom" button
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceToBottom > 200);
  };

  const handleCopyTranscript = () => {
    const transcript = [
      `--- Chat Transcript with ${conversation.customer_name} (${conversation.customer_email}) ---`,
      `Status: ${conversation.status.toUpperCase()}`,
      `Created: ${conversation.created_at}`,
      `Total Messages: ${messages.length}`,
      `--------------------------------------------------`,
      ...messages.map((m) => {
        const time = new Date(m.created_at).toLocaleTimeString();
        const role = m.sender_type === 'ai' ? `[AI Support - ${m.model_name || 'Bot'}]` : `[Customer - ${conversation.customer_name}]`;
        return `${time} ${role}:\n${m.content}\n`;
      }),
    ].join('\n');

    navigator.clipboard.writeText(transcript);
    setCopiedTranscript(true);
    setTimeout(() => setCopiedTranscript(false), 2000);
  };

  return (
    <div id="main-chat-panel" className="flex-1 flex flex-col h-full bg-zinc-50/50 min-w-0 relative">
      {/* Chat Top Header */}
      <ChatHeader
        conversation={conversation}
        onUpdateStatus={onUpdateStatus}
        onToggleDetails={onToggleDetails}
        isDetailsOpen={isDetailsOpen}
        onSimulateMessage={onSimulateMessage}
        onCopyTranscript={handleCopyTranscript}
        copiedTranscript={copiedTranscript}
      />

      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        id="messages-scroll-area"
        className="flex-1 overflow-y-auto px-6 py-4 relative"
      >
        {isLoadingMessages ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-400 gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-xs">Loading conversation history...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <MessageSquareOff className="w-8 h-8 text-zinc-300 mb-2" />
            <p className="text-xs font-medium text-zinc-600">No messages found in this conversation</p>
            <p className="text-[11px] text-zinc-400 max-w-sm mt-1">
              New customer inquiries and AI agent answers will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Conversation Start Marker */}
            <div className="flex items-center justify-center my-4">
              <div className="text-[11px] text-zinc-400 bg-white/80 px-3 py-1 rounded-full border border-zinc-200/60 shadow-2xs font-medium">
                Conversation started • {new Date(conversation.created_at).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>

            {/* Message Feed */}
            {messages.map((message) => (
              <ChatMessageItem
                key={message.id}
                message={message}
                conversation={conversation}
              />
            ))}
          </div>
        )}

        {/* Scroll To Bottom Button */}
        {showScrollBottom && (
          <button
            id="jump-to-bottom-btn"
            onClick={() => scrollToBottom(true)}
            className="fixed bottom-14 right-8 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 text-white rounded-full text-xs font-medium shadow-md hover:bg-zinc-800 transition-all animate-bounce"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Newest messages</span>
          </button>
        )}
      </div>

      {/* Terminal Footer Bar */}
      <div 
        id="chat-footer-terminal"
        className="px-5 py-2.5 bg-white border-t border-zinc-200 text-xs text-zinc-500 flex items-center justify-between gap-2 flex-shrink-0"
      >
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium text-zinc-700">Manager Supervisory Mode</span>
          <span className="text-zinc-400 hidden sm:inline">— Chat history viewer (Realtime updates active)</span>
        </div>

        <div className="text-[11px] text-zinc-400">
          {messages.length} total messages
        </div>
      </div>
    </div>
  );
};
