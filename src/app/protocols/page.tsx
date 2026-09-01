'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtocolCard from '@/components/ProtocolCard'; // or your component path

// 1. Define the Protocol interface
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
  // 2. Explicitly type the useState array as Protocol[]
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
      <h1 className="text-2xl font-bold mb-6">Month-End Protocols & SOP Library</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-500">Loading protocols...</p>
        ) : protocols.length > 0 ? (
          protocols.map((protocol) => (
            <ProtocolCard key={protocol.id} protocol={protocol} />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-500">
            No protocols found.
          </div>
        )}
      </div>
    </div>
  );
}