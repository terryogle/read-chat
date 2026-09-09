import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Calendar, 
  Tag, 
  MessageSquare, 
  ShieldCheck, 
  Copy, 
  Check, 
  Clock, 
  Layers, 
  Database 
} from 'lucide-react';
import { Conversation, ConversationStatus } from '../types';
import { getStatusBadge, getAvatarColor, getInitials, formatFullDateTime } from '../lib/formatters';

interface ConversationDetailsProps {
  conversation: Conversation;
  onClose: () => void;
  onUpdateStatus: (status: ConversationStatus) => void;
  isSupabaseConnected: boolean;
}

export const ConversationDetails: React.FC<ConversationDetailsProps> = ({
  conversation,
  onClose,
  onUpdateStatus,
  isSupabaseConnected,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const badge = getStatusBadge(conversation.status);
  const avatarColor = getAvatarColor(conversation.customer_name);
  const initials = getInitials(conversation.customer_name);

  const handleCopyId = () => {
    navigator.clipboard.writeText(conversation.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <aside
      id="conversation-details-drawer"
      className="w-80 lg:w-88 flex-shrink-0 border-l border-zinc-200 bg-white h-full flex flex-col z-10 select-none animate-in slide-in-from-right duration-200"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-zinc-900 tracking-tight">
          Conversation Details
        </h3>
        <button
          id="close-details-drawer-btn"
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Customer Profile Box */}
        <div className="flex flex-col items-center text-center pb-5 border-b border-zinc-100">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-base border mb-3 ${avatarColor.bg} ${avatarColor.text} ${avatarColor.border}`}
          >
            {initials}
          </div>
          <h4 className="font-semibold text-sm text-zinc-900">
            {conversation.customer_name}
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            {conversation.customer_email}
          </p>

          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.classes}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dotColor}`} />
              {badge.label}
            </span>
          </div>
        </div>

        {/* Manager Actions: Quick Status */}
        <div>
          <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
            Change Conversation Status
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['open', 'pending', 'resolved'] as ConversationStatus[]).map((status) => (
              <button
                key={status}
                id={`details-status-${status}`}
                onClick={() => onUpdateStatus(status)}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                  conversation.status === status
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Metadata items */}
        <div className="space-y-3.5">
          <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
            Session Properties
          </label>

          {/* Conversation ID */}
          <div className="bg-zinc-50 rounded-lg p-2.5 border border-zinc-200/80">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
              <span>Conversation ID</span>
              <button
                id="copy-conv-id-btn"
                onClick={handleCopyId}
                className="text-zinc-400 hover:text-zinc-800 transition-colors flex items-center gap-1"
              >
                {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <code className="text-xs text-zinc-800 font-mono break-all select-all">
              {conversation.id}
            </code>
          </div>

          {/* Created Date */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-100">
            <span className="text-zinc-500 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              Created
            </span>
            <span className="font-medium text-zinc-800 text-right">
              {formatFullDateTime(conversation.created_at)}
            </span>
          </div>

          {/* Last Activity */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-100">
            <span className="text-zinc-500 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              Last Activity
            </span>
            <span className="font-medium text-zinc-800 text-right">
              {formatFullDateTime(conversation.last_message_at || conversation.updated_at)}
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-100">
            <span className="text-zinc-500 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              Category
            </span>
            <span className="font-medium text-zinc-800">
              {conversation.category || 'General Support'}
            </span>
          </div>

          {/* Database Source */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-zinc-100">
            <span className="text-zinc-500 flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-zinc-400" />
              Storage Origin
            </span>
            <span className="font-medium text-zinc-800">
              {isSupabaseConnected ? 'Supabase (Live DB)' : 'Local Demo Dataset'}
            </span>
          </div>
        </div>

        {/* Tags */}
        {conversation.tags && conversation.tags.length > 0 && (
          <div>
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block mb-2">
              Assigned Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {conversation.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200"
                >
                  <Tag className="w-2.5 h-2.5 text-zinc-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
