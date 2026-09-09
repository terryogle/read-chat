export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'closed';

export type SenderType = 'customer' | 'ai' | 'system';

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: SenderType;
  content: string;
  created_at: string;
  model_name?: string;
  metadata?: {
    sentiment?: 'positive' | 'neutral' | 'frustrated';
    category?: string;
    tokens?: number;
    latency_ms?: number;
  };
}

export interface Conversation {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_avatar?: string;
  status: ConversationStatus;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
  category?: string;
  tags?: string[];
  messages_count?: number;
  unread?: boolean;
}

export type FilterStatus = 'all' | 'open' | 'pending' | 'resolved';
export type SortOption = 'newest' | 'oldest' | 'updated';

export interface SupabaseConfigState {
  isConfigured: boolean;
  url: string;
  hasKey: boolean;
  realtimeActive: boolean;
  lastRealtimeEvent?: {
    table: string;
    type: string;
    timestamp: string;
  };
}
