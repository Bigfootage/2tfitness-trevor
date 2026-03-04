'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { DailyMetric, METRIC_DEFINITIONS, MetricKey } from '@/types/metrics';
import { updateMetric, deleteMetric } from '@/lib/metrics';

interface DataTableProps {
  data: DailyMetric[];
  onRefresh: () => void;
}

export default function DataTable({ data, onRefresh }: DataTableProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editVals, setEditVals] = useState<Partial<DailyMetric>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (row: DailyMetric) => { setEditId(row.id); setEditVals({ ...row }); };
  const cancelEdit = () => { setEditId(null); setEditVals({}); };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(true);
    try {
      await updateMetric(editId, editVals);
      cancelEdit();
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async (id: string) => {
    await deleteMetric(id);
    setDeleteId(null);
    onRefresh();
  };

  if (!data.length) {
    return <p className="text-sm text-white/25 py-16 text-center">No entries yet. Add your first daily entry above.</p>;
  }

  return (
    <div className="space-y-2">
      {data.map((row, i) => (
        <motion.div
          key={row.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.025 }}
          className="rounded-xl border border-white/8 bg-white/3 overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
            <div className="flex items-center gap-3 min-w-0">
              <span className="font-semibold text-white shrink-0">
                {format(parseISO(row.date), 'EEE, MMM d yyyy')}
              </span>
              {row.notes && (
                <span className="text-xs text-white/30 italic truncate hidden sm:block">{row.notes}</span>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              {editId === row.id ? (
                <>
                  <button onClick={saveEdit} disabled={saving}
                    className="px-3 py-1.5 text-xs font-medium bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={cancelEdit}
                    className="px-3 py-1.5 text-xs font-medium bg-white/8 text-white/60 rounded-lg hover:bg-white/12 transition-colors">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(row)}
                    className="px-3 py-1.5 text-xs font-medium bg-white/8 text-white/60 rounded-lg hover:bg-white/12 hover:text-white transition-colors">
                    Edit
                  </button>
                  <button onClick={() => setDeleteId(row.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-white/5 text-red-400/60 rounded-lg hover:bg-red-900/20 hover:text-red-400 transition-colors">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="px-5 py-4">
            {editId === row.id ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {METRIC_DEFINITIONS.map((def) => (
                  <div key={def.key}>
                    <label className="block text-[10px] text-white/35 mb-1">{def.shortLabel}</label>
                    <input
                      type="number" min="0"
                      value={(editVals[def.key as MetricKey] as number) ?? 0}
                      onChange={(e) => setEditVals((v) => ({ ...v, [def.key]: Number(e.target.value) }))}
                      className="w-full px-3 py-2 rounded-lg bg-white/8 border border-white/10 text-white text-sm focus:outline-none focus:border-red-700/60 transition-all"
                    />
                  </div>
                ))}
                <div className="col-span-2 sm:col-span-3 lg:col-span-5">
                  <label className="block text-[10px] text-white/35 mb-1">Notes</label>
                  <input
                    type="text"
                    value={editVals.notes ?? ''}
                    onChange={(e) => setEditVals((v) => ({ ...v, notes: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-white/8 border border-white/10 text-white text-sm focus:outline-none focus:border-red-700/60 transition-all"
                    placeholder="Notes…"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                {METRIC_DEFINITIONS.map((def) => (
                  <div key={def.key} className="text-center">
                    <div className="text-lg font-bold text-white">{row[def.key as MetricKey]}</div>
                    <div className="text-[9px] text-white/25 leading-tight mt-0.5">{def.shortLabel}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <AnimatePresence>
            {deleteId === row.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-5 py-3 bg-red-950/30 border-t border-red-900/30 flex flex-wrap items-center gap-3"
              >
                <p className="text-sm text-red-300">
                  Delete entry for {format(parseISO(row.date), 'MMM d, yyyy')}? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button onClick={() => confirmDelete(row.id)}
                    className="px-3 py-1 text-xs font-medium bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Confirm
                  </button>
                  <button onClick={() => setDeleteId(null)}
                    className="px-3 py-1 text-xs font-medium bg-white/8 text-white/60 rounded-lg hover:bg-white/12 transition-colors">
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
