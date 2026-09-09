import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import { Conversation, Message, ConversationStatus } from '../types';
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES } from '../data/sampleData';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('xyzcompany')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export const SUPABASE_SCHEMA_SQL = `-- Run this in your Supabase SQL Editor to prepare your database for AI Support Admin Panel:

-- 1. Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'closed')),
    category TEXT DEFAULT 'General',
    last_message TEXT DEFAULT '',
    last_message_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    conversation_id TEXT NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'ai', 'system')),
    content TEXT NOT NULL,
    model_name TEXT DEFAULT 'AI Assistant',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable Row Level Security (RLS) and allow read/update for public anon (or tailor to your auth rules)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to conversations" 
ON public.conversations FOR SELECT USING (true);

CREATE POLICY "Allow public update access to conversations" 
ON public.conversations FOR UPDATE USING (true);

CREATE POLICY "Allow public insert to conversations" 
ON public.conversations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to messages" 
ON public.messages FOR SELECT USING (true);

CREATE POLICY "Allow public insert to messages" 
ON public.messages FOR INSERT WITH CHECK (true);

-- 4. Enable Supabase Realtime for instant updates in the Admin Panel
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
`;

/**
 * Fetch all conversations from Supabase, or fallback to sample dataset
 */
export async function getConversations(): Promise<{
  data: Conversation[];
  source: 'supabase' | 'sample';
  error?: string;
}> {
  if (!supabase) {
    return { data: INITIAL_CONVERSATIONS, source: 'sample' };
  }

  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error, falling back to sample data:', error.message);
      return { data: INITIAL_CONVERSATIONS, source: 'sample', error: error.message };
    }

    if (!data || data.length === 0) {
      return { data: INITIAL_CONVERSATIONS, source: 'sample', error: 'No records in conversations table yet' };
    }

    // Map fields gracefully to handle varying column naming conventions
    const formatted: Conversation[] = data.map((item: any) => ({
      id: String(item.id),
      customer_name: item.customer_name || item.name || item.user_name || 'Customer',
      customer_email: item.customer_email || item.email || item.user_email || 'user@example.com',
      status: (item.status as ConversationStatus) || 'open',
      last_message: item.last_message || item.preview || '',
      last_message_at: item.last_message_at || item.updated_at || item.created_at || new Date().toISOString(),
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || item.created_at || new Date().toISOString(),
      category: item.category || 'General Support',
      tags: Array.isArray(item.tags) ? item.tags : [],
      messages_count: item.messages_count || undefined,
    }));

    return { data: formatted, source: 'supabase' };
  } catch (err: any) {
    return { data: INITIAL_CONVERSATIONS, source: 'sample', error: err.message };
  }
}

/**
 * Fetch messages for a specific conversation
 */
export async function getMessages(
  conversationId: string
): Promise<{ data: Message[]; source: 'supabase' | 'sample'; error?: string }> {
  if (!supabase) {
    const msgs = INITIAL_MESSAGES[conversationId] || [];
    return { data: msgs, source: 'sample' };
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase messages error, fallback to sample:', error.message);
      const msgs = INITIAL_MESSAGES[conversationId] || [];
      return { data: msgs, source: 'sample', error: error.message };
    }

    if (!data || data.length === 0) {
      const fallbackMsgs = INITIAL_MESSAGES[conversationId] || [];
      return { data: fallbackMsgs, source: fallbackMsgs.length > 0 ? 'sample' : 'supabase' };
    }

    const formatted: Message[] = data.map((item: any) => ({
      id: String(item.id),
      conversation_id: String(item.conversation_id),
      sender_type: (item.sender_type || item.sender || item.role === 'assistant' ? 'ai' : item.sender_type || 'customer'),
      content: item.content || item.text || item.message || '',
      created_at: item.created_at || new Date().toISOString(),
      model_name: item.model_name || (item.sender_type === 'ai' ? 'Support AI' : undefined),
    }));

    return { data: formatted, source: 'supabase' };
  } catch (err: any) {
    const msgs = INITIAL_MESSAGES[conversationId] || [];
    return { data: msgs, source: 'sample', error: err.message };
  }
}

/**
 * Update status of a conversation (e.g., mark resolved or reopen)
 */
export async function updateConversationStatus(
  conversationId: string,
  status: ConversationStatus
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('conversations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Insert a message to Supabase (useful for real-time testing or simulation)
 */
export async function insertMessage(
  conversationId: string,
  senderType: 'customer' | 'ai',
  content: string,
  modelName?: string
): Promise<{ data: Message | null; error?: string }> {
  const newMsg: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    conversation_id: conversationId,
    sender_type: senderType,
    content,
    created_at: new Date().toISOString(),
    model_name: senderType === 'ai' ? (modelName || 'Support AI') : undefined,
  };

  if (!supabase) {
    return { data: newMsg };
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        id: newMsg.id,
        conversation_id: conversationId,
        sender_type: senderType,
        content,
        model_name: newMsg.model_name,
        created_at: newMsg.created_at,
      })
      .select()
      .single();

    if (error) {
      return { data: newMsg, error: error.message };
    }

    // Also update conversations last_message
    await supabase
      .from('conversations')
      .update({
        last_message: content,
        last_message_at: newMsg.created_at,
        updated_at: newMsg.created_at,
      })
      .eq('id', conversationId);

    return {
      data: {
        id: String(data.id),
        conversation_id: String(data.conversation_id),
        sender_type: data.sender_type,
        content: data.content,
        created_at: data.created_at,
        model_name: data.model_name,
      },
    };
  } catch (err: any) {
    return { data: newMsg, error: err.message };
  }
}

/**
 * Helper to seed sample data directly into the user's Supabase instance
 */
export async function seedSampleDataToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) {
    return { success: false, count: 0, error: 'Supabase client is not initialized' };
  }

  try {
    // 1. Insert conversations
    const convInserts = INITIAL_CONVERSATIONS.map((c) => ({
      id: c.id,
      customer_name: c.customer_name,
      customer_email: c.customer_email,
      status: c.status,
      category: c.category || 'Support',
      last_message: c.last_message || '',
      last_message_at: c.last_message_at,
      created_at: c.created_at,
      updated_at: c.updated_at,
    }));

    const { error: convErr } = await supabase.from('conversations').upsert(convInserts);
    if (convErr) {
      return { success: false, count: 0, error: convErr.message };
    }

    // 2. Insert messages
    const allMsgs: any[] = [];
    Object.values(INITIAL_MESSAGES).forEach((msgList) => {
      msgList.forEach((m) => {
        allMsgs.push({
          id: m.id,
          conversation_id: m.conversation_id,
          sender_type: m.sender_type,
          content: m.content,
          model_name: m.model_name || null,
          created_at: m.created_at,
        });
      });
    });

    const { error: msgErr } = await supabase.from('messages').upsert(allMsgs);
    if (msgErr) {
      return { success: false, count: convInserts.length, error: msgErr.message };
    }

    return { success: true, count: convInserts.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message };
  }
}
