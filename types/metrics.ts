export interface DailyMetric {
  id: string;
  date: string;
  lifestyle_commenters_reached: number;
  story_poll_voters_reached: number;
  engaged_followers_reached: number;
  new_followers_reached: number;
  follow_ups: number;
  offers_to_book: number;
  booking_links_sent: number;
  calls_booked: number;
  deals_closed: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type MetricKey =
  | 'lifestyle_commenters_reached'
  | 'story_poll_voters_reached'
  | 'engaged_followers_reached'
  | 'new_followers_reached'
  | 'follow_ups'
  | 'offers_to_book'
  | 'booking_links_sent'
  | 'calls_booked'
  | 'deals_closed';

export interface MetricDefinition {
  key: MetricKey;
  label: string;
  shortLabel: string;
  color: string;
  description: string;
}

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    key: 'lifestyle_commenters_reached',
    label: '"Lifestyle" Commenters Reached',
    shortLabel: 'Lifestyle Commenters',
    color: '#DC2626',
    description: 'People who commented on Lifestyle posts',
  },
  {
    key: 'story_poll_voters_reached',
    label: 'Story Poll Voters Reached',
    shortLabel: 'Poll Voters',
    color: '#EF4444',
    description: 'People who voted on story polls',
  },
  {
    key: 'engaged_followers_reached',
    label: 'Engaged Followers Reached',
    shortLabel: 'Engaged Followers',
    color: '#F87171',
    description: 'Existing followers who engage regularly',
  },
  {
    key: 'new_followers_reached',
    label: 'New Followers Reached',
    shortLabel: 'New Followers',
    color: '#FCA5A5',
    description: 'Newly followed accounts contacted',
  },
  {
    key: 'follow_ups',
    label: 'Follow-Ups Sent',
    shortLabel: 'Follow-Ups',
    color: '#F97316',
    description: 'Follow-up messages sent to prospects',
  },
  {
    key: 'offers_to_book',
    label: 'Offers to Book a Call',
    shortLabel: 'Book Offers',
    color: '#FB923C',
    description: 'Direct offers to book a call made',
  },
  {
    key: 'booking_links_sent',
    label: 'Booking Links Sent',
    shortLabel: 'Links Sent',
    color: '#FDBA74',
    description: 'Booking links sent to prospects',
  },
  {
    key: 'calls_booked',
    label: 'Calls Booked',
    shortLabel: 'Calls Booked',
    color: '#4ADE80',
    description: 'Calls successfully booked',
  },
  {
    key: 'deals_closed',
    label: 'Deals Closed',
    shortLabel: 'Deals Closed',
    color: '#22C55E',
    description: 'Deals successfully closed',
  },
];

export type PeriodFilter = 'today' | 'week' | 'month' | 'all';

export interface AggregatedMetrics {
  lifestyle_commenters_reached: number;
  story_poll_voters_reached: number;
  engaged_followers_reached: number;
  new_followers_reached: number;
  follow_ups: number;
  offers_to_book: number;
  booking_links_sent: number;
  calls_booked: number;
  deals_closed: number;
}
