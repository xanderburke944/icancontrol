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
      <h1 className="text-2xl font-bold tracking-tight mb-6">Month-End Protocols & SOPs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-500 text-sm">Loading protocols...</p>
        ) : protocols.length > 0 ? (
          protocols.map((protocol) => (
            <div key={protocol.id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                {protocol.category}
              </span>
              <h3 className="text-lg font-bold text-white mt-3">{protocol.title}</h3>
              <p className="text-slate-400 text-xs mt-2">{protocol.step_by_step_instructions}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-sm">No protocols found.</p>
        )}
      </div>
    </div>
  );
}