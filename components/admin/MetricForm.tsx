'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { METRIC_DEFINITIONS, MetricKey } from '@/types/metrics';
import { upsertMetric, fetchMetricByDate } from '@/lib/metrics';

interface MetricFormProps {
  onSuccess: () => void;
}

type FieldValues = Record<MetricKey, string> & { notes: string };

function emptyFields(): FieldValues {
  return {
    lifestyle_commenters_reached: '',
    story_poll_voters_reached: '',
    engaged_followers_reached: '',
    new_followers_reached: '',
    follow_ups: '',
    offers_to_book: '',
    booking_links_sent: '',
    calls_booked: '',
    deals_closed: '',
    notes: '',
  };
}

export default function MetricForm({ onSuccess }: MetricFormProps) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [fields, setFields] = useState<FieldValues>(emptyFields());
  const [existingId, setExistingId] = useState<string | null>(null);
  const [hint, setHint] = useState('');
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDateChange = async (d: string) => {
    setDate(d);
    if (!d) return;
    setChecking(true);
    try {
      const existing = await fetchMetricByDate(d);
      if (existing) {
        setExistingId(existing.id);
        setFields({
          lifestyle_commenters_reached: String(existing.lifestyle_commenters_reached),
          story_poll_voters_reached: String(existing.story_poll_voters_reached),
          engaged_followers_reached: String(existing.engaged_followers_reached),
          new_followers_reached: String(existing.new_followers_reached),
          follow_ups: String(existing.follow_ups),
          offers_to_book: String(existing.offers_to_book),
          booking_links_sent: String(existing.booking_links_sent),
          calls_booked: String(existing.calls_booked),
          deals_closed: String(existing.deals_closed),
          notes: existing.notes ?? '',
        });
        setHint('Entry exists — you are editing it.');
      } else {
        setExistingId(null);
        setFields(emptyFields());
        setHint('');
      }
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setErrorMsg('');
    try {
      await upsertMetric({
        date,
        lifestyle_commenters_reached: Number(fields.lifestyle_commenters_reached) || 0,
        story_poll_voters_reached: Number(fields.story_poll_voters_reached) || 0,
        engaged_followers_reached: Number(fields.engaged_followers_reached) || 0,
        new_followers_reached: Number(fields.new_followers_reached) || 0,
        follow_ups: Number(fields.follow_ups) || 0,
        offers_to_book: Number(fields.offers_to_book) || 0,
        booking_links_sent: Number(fields.booking_links_sent) || 0,
        calls_booked: Number(fields.calls_booked) || 0,
        deals_closed: Number(fields.deals_closed) || 0,
        notes: fields.notes,
      });
      setStatus('success');
      onSuccess();
      setTimeout(() => {
        setStatus('idle');
        setFields(emptyFields());
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setExistingId(null);
        setHint('');
      }, 2500);
    } catch {
      setStatus('error');
      setErrorMsg('Failed to save. Please try again.');
    }
  };

  const set = (key: string, val: string) => setFields((f) => ({ ...f, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Date</label>
        <div className="relative w-fit">
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-red-700/60 focus:ring-1 focus:ring-red-700/30 transition-all"
          />
          {checking && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30">checking…</span>}
        </div>
        {hint && <p className="text-xs text-amber-400/70 mt-1.5">{hint}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {METRIC_DEFINITIONS.map((def) => (
          <div key={def.key}>
            <label className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: def.color }} />
              {def.label}
            </label>
            <input
              type="number"
              min="0"
              value={fields[def.key as MetricKey]}
              onChange={(e) => set(def.key, e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xl font-semibold placeholder:text-white/15 focus:outline-none focus:border-red-700/60 focus:ring-1 focus:ring-red-700/30 transition-all"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Notes (optional)</label>
        <textarea
          value={fields.notes}
          onChange={(e) => set('notes', e.target.value)}
          rows={3}
          placeholder="Any notes about today…"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/15 focus:outline-none focus:border-red-700/60 focus:ring-1 focus:ring-red-700/30 transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === 'saving' || status === 'success'}
          className={[
            'px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
            status === 'success' ? 'bg-green-700 text-white shadow-[0_0_20px_rgba(34,197,94,0.35)]' : '',
            status === 'saving' ? 'bg-red-900/40 text-white/50 cursor-wait' : '',
            status === 'idle' || status === 'error'
              ? 'bg-red-700 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(185,28,28,0.35)] hover:shadow-[0_0_30px_rgba(185,28,28,0.5)]'
              : '',
          ].join(' ')}
        >
          {status === 'saving' ? 'Saving…' : status === 'success' ? 'Saved!' : existingId ? 'Update Entry' : 'Save Entry'}
        </button>

        <AnimatePresence>
          {status === 'error' && (
            <motion.p initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-sm text-red-400">
              {errorMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
