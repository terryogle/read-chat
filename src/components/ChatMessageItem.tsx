import React from 'react';
import Markdown from 'react-markdown';
import { Bot, User, Sparkles, Clock, CheckCheck } from 'lucide-react';
import { Message, Conversation } from '../types';
import { formatExactTime, getInitials, getAvatarColor } from '../lib/formatters';

interface ChatMessageItemProps {
  message: Message;
  conversation: Conversation;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, conversation }) => {
  const isAI = message.sender_type === 'ai';
  const isCustomer = message.sender_type === 'customer';
  const isSystem = message.sender_type === 'system';

  if (isSystem) {
    return (
      <div className="flex items-center justify-center my-4">
        <span className="text-[11px] font-medium text-zinc-400 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200/70">
          {message.content}
        </span>
      </div>
    );
  }

  const avatarColor = getAvatarColor(conversation.customer_name);
  const initials = getInitials(conversation.customer_name);

  return (
    <div
      id={`message-${message.id}`}
      className={`flex items-start gap-3 my-4 group ${
        isAI ? 'flex-row' : 'flex-row'
      }`}
    >
      {/* Avatar column */}
      <div className="flex-shrink-0 mt-0.5">
        {isAI ? (
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-emerald-400 border border-zinc-700 flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
        ) : (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs border ${avatarColor.bg} ${avatarColor.text} ${avatarColor.border}`}
          >
            {initials}
          </div>
        )}
      </div>

      {/* Message Bubble Container */}
      <div className="flex-1 max-w-3xl min-w-0">
        {/* Sender Label & Timestamp Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-zinc-900">
            {isAI ? (message.model_name || 'AI Support Assistant') : conversation.customer_name}
          </span>

          {isAI && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              <Bot className="w-2.5 h-2.5" />
              AI Automated
            </span>
          )}

          {!isAI && isCustomer && (
            <span className="text-[10px] text-zinc-500 font-medium">
              Customer
            </span>
          )}

          <span className="text-[11px] text-zinc-400 font-normal">
            {formatExactTime(message.created_at)}
          </span>
        </div>

        {/* Bubble Content */}
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed transition-all shadow-xs ${
            isAI
              ? 'bg-zinc-50/90 border-zinc-200/90 text-zinc-800'
              : 'bg-white border-zinc-200 text-zinc-900'
          }`}
        >
          {isAI ? (
            <div className="prose-xs max-w-none text-zinc-800 space-y-2.5 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&>pre]:bg-zinc-900 [&>pre]:text-zinc-100 [&>pre]:p-3 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>code]:bg-zinc-200/70 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-[11px] [&>h3]:font-semibold [&>h3]:text-zinc-900 [&>h3]:mt-2">
              <Markdown>{message.content}</Markdown>
            </div>
          ) : (
            <p className="whitespace-pre-wrap leading-relaxed text-zinc-800 font-normal">
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
