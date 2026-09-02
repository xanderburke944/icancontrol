'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface Protocol {
  id: string;
  practice_id?: string | null;
  title: string;
  category: string;
  step_by_step_instructions?: string;
  document_url?: string | null;
  version?: string;
  created_at?: string;
}

export default function ProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProtocols();
  }, []);

  async function fetchProtocols() {
    setLoading(true);
    const { data, error } = await supabase
      .from('protocols')
      .select('*')
      .order('category', { ascending: true });

    if (!error && data) {
      setProtocols(data as Protocol[]);
    }
    setLoading(false);
  }

  return (
    <div className="p-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Month-End Protocols & SOPs</h1>
          <p className="text-slate-400 text-sm">Standard operating procedures and execution steps per practice.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-500 text-sm">Loading protocols...</p>
        ) : protocols.length > 0 ? (
          protocols.map((protocol: Protocol) => (
            <div 
              key={protocol.id} 
              className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  {protocol.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-3">{protocol.title}</h3>
                <p className="text-slate-400 text-xs mt-2 line-clamp-3">
                  {protocol.step_by_step_instructions || 'No detailed steps added.'}
                </p>
              </div>

              {protocol.document_url && (
                <a
                  href={protocol.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 text-xs font-medium text-cyan-400 hover:underline flex items-center gap-1"
                >
                  📄 View SOP Document
                </a>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-500 text-sm">
            No protocols or procedures found.
          </div>
        )}
      </div>
    </div>
  );
}
