'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Practice {
  id: string;
  practice_name: string;
  practice_number: string;
}

interface AgeingRecord {
  id: string;
  practice_id: string;
  period_date: string;
  current_balance: number;
  days_30: number;
  days_60: number;
  days_90: number;
  days_120_plus: number;
  total_outstanding: number;
  file_url: string | null;
  status: string;
  action_notes: string;
  practices: {
    practice_name: string;
    practice_number: string;
  };
}

export default function AgeingTrackerPage() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [records, setRecords] = useState<AgeingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [selectedPracticeId, setSelectedPracticeId] = useState('');
  const [periodDate, setPeriodDate] = useState(new Date().toISOString().slice(0, 7) + '-01');
  const [currentBal, setCurrentBal] = useState('0');
  const [d30, setD30] = useState('0');
  const [d60, setD60] = useState('0');
  const [d90, setD90] = useState('0');
  const [d120, setD120] = useState('0');
  const [actionNotes, setActionNotes] = useState('');
  const [status, setStatus] = useState('Pending Review');
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);

    // Fetch Practice List for Dropdown
    const { data: practiceData } = await supabase
      .from('practices')
      .select('id, practice_name, practice_number')
      .order('practice_name', { ascending: true });

    if (practiceData) setPractices(practiceData);

    // Fetch Ageing Analysis Records with joined Practice details
    const { data: ageingData, error } = await supabase
      .from('ageing_analysis')
      .select(`
        *,
        practices (
          practice_name,
          practice_number
        )
      `)
      .order('period_date', { ascending: false });

    if (!error && ageingData) {
      setRecords(ageingData as unknown as AgeingRecord[]);
    }

    setLoading(false);
  }

  // Handle PDF/Excel Upload + Record Insertion
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPracticeId) return alert('Please select a practice.');

    setUploading(true);
    let publicFileUrl: string | null = null;

    try {
      // 1. Upload File to Supabase Storage if present
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${selectedPracticeId}/${periodDate}_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('ageing_documents')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get Signed or Public Storage URL
        const { data: urlData } = supabase.storage
          .from('ageing_documents')
          .getPublicUrl(fileName);

        publicFileUrl = urlData.publicUrl;
      }

      // 2. Insert Ageing Record into Postgres Database
      const { error: insertError } = await supabase.from('ageing_analysis').insert([
        {
          practice_id: selectedPracticeId,
          period_date: periodDate,
          current_balance: parseFloat(currentBal) || 0,
          days_30: parseFloat(d30) || 0,
          days_60: parseFloat(d60) || 0,
          days_90: parseFloat(d90) || 0,
          days_120_plus: parseFloat(d120) || 0,
          status: status,
          action_notes: actionNotes,
          file_url: publicFileUrl,
        },
      ]);

      if (insertError) throw insertError;

      // Reset Form & Refresh
      setShowModal(false);
      resetForm();
      fetchInitialData();
    } catch (err: any) {
      alert(`Error saving record: ${err.message}`);
    } finally {
      setUploading(false);
    }
  }

  // Quick inline status updater for ongoing claims tracking
  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from('ageing_analysis')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setRecords((prev) =>
        prev.map((rec) => (rec.id === id ? { ...rec, status: newStatus } : rec))
      );
    }
  }

  function resetForm() {
    setSelectedPracticeId('');
    setCurrentBal('0');
    setD30('0');
    setD60('0');
    setD90('0');
    setD120('0');
    setActionNotes('');
    setFile(null);
    setStatus('Pending Review');
  }

  return (
    <div className="p-8 bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ageing Analysis & Claims Tracking</h1>
          <p className="text-slate-400 text-sm">Log monthly balances, attach files, and manage follow-ups.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          + Load Ageing Document
        </button>
      </div>

      {/* Main Records Table */}
      <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/50">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4 font-semibold">Practice</th>
              <th className="p-4 font-semibold">Period</th>
              <th className="p-4 font-semibold">Total Outstanding</th>
              <th className="p-4 font-semibold">120+ Days</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Document</th>
              <th className="p-4 font-semibold">Follow-Up Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-500">
                  Loading ageing analysis records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-500">
                  No ageing reports loaded yet.
                </td>
              </tr>
            ) : (
              records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-medium text-white">
                    {rec.practices?.practice_name}
                    <div className="text-xs text-slate-500 font-mono">
                      BHF: {rec.practices?.practice_number}
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 font-mono">
                    {new Date(rec.period_date).toLocaleDateString('en-ZA', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td className="p-4 font-semibold text-slate-100 font-mono">
                    R {rec.total_outstanding?.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4 font-mono text-rose-400">
                    R {rec.days_120_plus?.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4">
                    <select
                      value={rec.status}
                      onChange={(e) => updateStatus(rec.id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 text-xs rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Pending Review">Pending Review</option>
                      <option value="In Follow-Up">In Follow-Up</option>
                      <option value="Queries Sent">Queries Sent</option>
                      <option value="Reconciled">Reconciled</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {rec.file_url ? (
                      <a
                        href={rec.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline text-xs flex items-center gap-1 font-medium"
                      >
                        📄 View Report
                      </a>
                    ) : (
                      <span className="text-slate-600 text-xs">No File</span>
                    )}
                  </td>
                  <td className="p-4 text-slate-400 max-w-xs truncate text-xs">
                    {rec.action_notes || 'No follow-up notes.'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Uploading Ageing Report */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-2xl text-slate-100 shadow-2xl">
            <h2 className="text-xl font-bold mb-1">Load Ageing Analysis</h2>
            <p className="text-slate-400 text-xs mb-6">Attach monthly summary and break down outstanding claims.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Select Practice *</label>
                  <select
                    required
                    value={selectedPracticeId}
                    onChange={(e) => setSelectedPracticeId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="">-- Choose Practice --</option>
                    {practices.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.practice_name} ({p.practice_number})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Month Period *</label>
                  <input
                    type="date"
                    required
                    value={periodDate}
                    onChange={(e) => setPeriodDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Outstanding Breakdown Fields */}
              <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Current (R)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentBal}
                    onChange={(e) => setCurrentBal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">30 Days (R)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={d30}
                    onChange={(e) => setD30(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">60 Days (R)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={d60}
                    onChange={(e) => setD60(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">90 Days (R)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={d90}
                    onChange={(e) => setD90(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-rose-400 mb-1">120+ Days (R)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={d120}
                    onChange={(e) => setD120(e.target.value)}
                    className="w-full bg-slate-900 border border-rose-950 text-rose-200 rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm"
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="In Follow-Up">In Follow-Up</option>
                  </select>
                </div>
              </div>

              {/* Document File Uploader */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Attach Ageing Report (PDF / XLSX)</label>
                <input
                  type="file"
                  accept=".pdf,.xlsx,.xls,.csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              {/* Follow-up Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Claims Follow-up Notes / Queries</label>
                <textarea
                  rows={3}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="e.g. Discovery queries sent regarding authorization on claims > 90 days..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
                >
                  {uploading ? 'Uploading & Saving...' : 'Save Ageing Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}