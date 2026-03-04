import { supabase } from './supabase';
import { DailyMetric, AggregatedMetrics, PeriodFilter } from '@/types/metrics';
import { format, startOfWeek, startOfMonth } from 'date-fns';

function getDateRange(period: PeriodFilter): { from: string; to: string } | null {
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  if (period === 'today') return { from: todayStr, to: todayStr };
  if (period === 'week') {
    return { from: format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd'), to: todayStr };
  }
  if (period === 'month') {
    return { from: format(startOfMonth(today), 'yyyy-MM-dd'), to: todayStr };
  }
  return null;
}

export async function fetchMetrics(period: PeriodFilter): Promise<DailyMetric[]> {
  let query = supabase.from('daily_metrics').select('*').order('date', { ascending: false });
  const range = getDateRange(period);
  if (range) query = query.gte('date', range.from).lte('date', range.to);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllMetrics(): Promise<DailyMetric[]> {
  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMetricByDate(date: string): Promise<DailyMetric | null> {
  const { data, error } = await supabase
    .from('daily_metrics')
    .select('*')
    .eq('date', date)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertMetric(
  metric: Omit<DailyMetric, 'id' | 'created_at' | 'updated_at'>
): Promise<DailyMetric> {
  const { data, error } = await supabase
    .from('daily_metrics')
    .upsert(metric, { onConflict: 'date' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMetric(id: string, updates: Partial<DailyMetric>): Promise<DailyMetric> {
  const { data, error } = await supabase
    .from('daily_metrics')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMetric(id: string): Promise<void> {
  const { error } = await supabase.from('daily_metrics').delete().eq('id', id);
  if (error) throw error;
}

export function aggregateMetrics(rows: DailyMetric[]): AggregatedMetrics {
  return rows.reduce(
    (acc, row) => ({
      lifestyle_commenters_reached: acc.lifestyle_commenters_reached + row.lifestyle_commenters_reached,
      story_poll_voters_reached: acc.story_poll_voters_reached + row.story_poll_voters_reached,
      engaged_followers_reached: acc.engaged_followers_reached + row.engaged_followers_reached,
      new_followers_reached: acc.new_followers_reached + row.new_followers_reached,
      follow_ups: acc.follow_ups + row.follow_ups,
      offers_to_book: acc.offers_to_book + row.offers_to_book,
      booking_links_sent: acc.booking_links_sent + row.booking_links_sent,
      calls_booked: acc.calls_booked + row.calls_booked,
      deals_closed: acc.deals_closed + row.deals_closed,
    }),
    {
      lifestyle_commenters_reached: 0,
      story_poll_voters_reached: 0,
      engaged_followers_reached: 0,
      new_followers_reached: 0,
      follow_ups: 0,
      offers_to_book: 0,
      booking_links_sent: 0,
      calls_booked: 0,
      deals_closed: 0,
    }
  );
}

export function totalReach(agg: AggregatedMetrics): number {
  return (
    agg.lifestyle_commenters_reached +
    agg.story_poll_voters_reached +
    agg.engaged_followers_reached +
    agg.new_followers_reached
  );
}

export function conversionRate(agg: AggregatedMetrics): number {
  const reach = totalReach(agg);
  if (reach === 0) return 0;
  return Math.round((agg.deals_closed / reach) * 1000) / 10;
}
