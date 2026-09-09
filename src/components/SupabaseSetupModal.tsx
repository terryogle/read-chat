import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Terminal, 
  Sparkles,
  Layers,
  UploadCloud
} from 'lucide-react';
import { SUPABASE_SCHEMA_SQL, seedSampleDataToSupabase } from '../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConfigured: boolean;
  onRefreshData: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  isConfigured,
  onRefreshData,
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await seedSampleDataToSupabase();
      if (res.success) {
        setSeedResult(`Successfully seeded ${res.count} conversations into your Supabase database!`);
        onRefreshData();
      } else {
        setSeedResult(`Notice: ${res.error || 'Could not seed tables. Ensure SQL schema has been executed first.'}`);
      }
    } catch (e: any) {
      setSeedResult(`Notice: ${e.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div 
      id="supabase-setup-backdrop"
      className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      <div 
        id="supabase-setup-dialog"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">
                HealthyLine • Supabase Connection & Setup
              </h2>
              <p className="text-xs text-zinc-500">
                Real-time configuration guide for HealthyLine Support Admin
              </p>
            </div>
          </div>
          <button
            id="close-setup-modal-btn"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-zinc-600 leading-relaxed">
          {/* Status Box */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isConfigured
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-zinc-50 border-zinc-200 text-zinc-800'
            }`}
          >
            {isConfigured ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <Zap className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-xs mb-0.5">
                {isConfigured
                  ? 'Connected to Live Supabase Instance'
                  : 'Currently in High-Fidelity Preview Mode'}
              </h4>
              <p className="text-[11px] leading-normal opacity-90">
                {isConfigured
                  ? 'Your Supabase credentials are detected. The panel reads directly from public.conversations and public.messages with Supabase Realtime enabled.'
                  : 'To connect to your own Supabase project, supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment configuration.'}
              </p>
            </div>
          </div>

          {/* Quick Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                Step 1: Run SQL Schema in Supabase
              </h4>
              <button
                id="copy-sql-schema-btn"
                onClick={handleCopySql}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-[11px] font-medium transition-colors"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Schema SQL</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-zinc-500">
              Open your Supabase Project Dashboard &gt; <strong>SQL Editor</strong> &gt; paste this script to create the tables and enable Realtime replication:
            </p>
            <pre className="bg-zinc-900 text-zinc-200 p-3.5 rounded-xl text-[11px] font-mono max-h-44 overflow-y-auto overflow-x-auto border border-zinc-800">
              {SUPABASE_SCHEMA_SQL}
            </pre>
          </div>

          {/* Quick Step 2 */}
          <div className="space-y-2 pt-2 border-t border-zinc-100">
            <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-500" />
              Step 2: Enable Supabase Realtime
            </h4>
            <p className="text-[11px] text-zinc-500">
              In your Supabase Dashboard &gt; <strong>Database</strong> &gt; <strong>Replication</strong>, ensure both <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800 font-mono">conversations</code> and <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800 font-mono">messages</code> tables have replication turned on. (The SQL script above does this automatically with <code className="bg-zinc-100 px-1 py-0.5 rounded text-zinc-800 font-mono">ALTER PUBLICATION supabase_realtime</code>).
            </p>
          </div>

          {/* Quick Step 3: Seed option if configured */}
          {isConfigured && (
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-zinc-900 flex items-center gap-1.5">
                    <UploadCloud className="w-3.5 h-3.5 text-zinc-500" />
                    Seed Initial Conversations
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    If your Supabase tables are fresh, you can populate them with sample customer tickets.
                  </p>
                </div>
                <button
                  id="seed-supabase-btn"
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg text-xs font-medium border border-zinc-300 transition-colors"
                >
                  {isSeeding ? 'Seeding...' : 'Populate Sample Chats'}
                </button>
              </div>
              {seedResult && (
                <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-700">
                  {seedResult}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center justify-end">
          <button
            id="close-modal-footer-btn"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
