'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Practice {
  id: string;
  practice_name: string;
  practice_number: string;
  client_name: string;
  specialty: string;
  phone: string;
  status: string;
}

export default function PracticesPage() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPractices();
  }, []);

  async function fetchPractices() {
    setLoading(true);
    const { data, error } = await supabase
      .from('practices')
      .select('*')
      .order('practice_name', { ascending: true });

    if (!error && data) {
      setPractices(data);
    }
    setLoading(false);
  }

  const filteredPractices = practices.filter(
    (p) =>
      p.practice_name.toLowerCase().includes(search.toLowerCase()) ||
      p.practice_number.includes(search) ||
      p.client_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Practice Directory</h1>
          <p className="text-slate-400 text-sm">I-10 Group Client Profiles & Master Data</p>
        </div>
        <button className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">
          + Add New Practice
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by practice name, BHF number, or doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
        />
      </div>

      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4 font-semibold">Practice Name</th>
              <th className="p-4 font-semibold">Practice No.</th>
              <th className="p-4 font-semibold">Client / Doctor</th>
              <th className="p-4 font-semibold">Specialty</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  Loading practices...
                </td>
              </tr>
            ) : filteredPractices.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  No practices found.
                </td>
              </tr>
            ) : (
              filteredPractices.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <td className="p-4 font-medium text-white">{p.practice_name}</td>
                  <td className="p-4 font-mono text-cyan-400">{p.practice_number}</td>
                  <td className="p-4 text-slate-300">{p.client_name}</td>
                  <td className="p-4 text-slate-400">{p.specialty || '—'}</td>
                  <td className="p-4 text-slate-400">{p.phone || '—'}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}