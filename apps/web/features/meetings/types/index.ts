
export type MeetingStatus = 'upcoming' | 'completed' | 'canceled';

/**
 * Participant Information
 * Represents a person attending a meeting
 */
export interface Participant {
  /** Unique identifier for the participant */
  id?: string;
  /** Full name of the participant */
  name: string;
  /** Initials of the participant (used for avatar display) */
  initial: string;
  /** Email address of the participant */
  email?: string;
  /** Confirmation status of the participant */
  status?: 'confirmed' | 'pending' | 'declined';
  /** Whether the participant is optional or required */
  isOptional?: boolean;
}

/**
 * Meeting Recurrence Configuration
 * Defines the recurrence pattern for recurring meetings
 */
export interface RecurrenceConfig {
  /** Whether the meeting is recurring */
  isRecurring: boolean;
  /** Recurrence frequency */
  frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly';
  /** Days of the week when meeting occurs (for weekly recurrence) */
  daysOfWeek?: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[];
  /** End date for recurrence (optional - if not set, recurs indefinitely) */
  endDate?: string;
  /** Number of occurrences (optional alternative to endDate) */
  occurrences?: number;
}

/**
 * Meeting Link/Conference Details
 * Information for joining the meeting
 */
export interface MeetingLink {
  /** URL of the meeting link */
  url: string;
  /** Type of conferencing service */
  provider?: 'zoom' | 'google-meet' | 'teams' | 'other';
  /** Meeting ID or room number */
  meetingId?: string;
  /** Password if required */
  password?: string;
}

/**
 * Meeting Availability/Conflict Info
 * Tracks scheduling conflicts and availability
 */
export interface AvailabilityInfo {
  /** Whether there's a scheduling conflict */
  hasConflict: boolean;
  /** Description of the conflict if any */
  conflictDetails?: string;
  /** List of participants with conflicts */
  conflictingParticipants?: string[];
  /** Suggested alternative time slots */
  alternativeSlots?: string[];
}

/**
 * Main Meeting Type
 * Complete meeting object with all relevant information
 */
export interface Meeting {
  /** Unique identifier for the meeting */
  id: string | number;
  /** Title/subject of the meeting */
  title: string;
  /** Detailed description of the meeting agenda */
  description?: string;
  /** Date of the meeting (YYYY-MM-DD format) */
  date: string;
  /** Start time of the meeting (HH:MM AM/PM format) */
  time: string;
  /** Duration of the meeting in minutes */
  duration?: number;
  /** End time (calculated or specified) */
  endTime?: string;
  /** Current status of the meeting */
  status: MeetingStatus;
  /** Array of meeting participants */
  participants: Participant[];
  /** Organizer/creator of the meeting */
  organizer?: Participant;
  /** Location or room name */
  location?: string;
  /** Meeting conference link details */
  meetingLink?: MeetingLink;
  /** Timezone of the meeting */
  timezone?: string;
  /** Recurrence configuration */
  recurrence?: RecurrenceConfig;
  /** Availability and conflict information */
  availability?: AvailabilityInfo;
  /** Quick flag for table rows (scheduling conflict); prefer `availability` when detailed */
  hasConflict?: boolean;
  /** Meeting notes or transcript */
  notes?: string;
  /** Attachments or file references */
  attachments?: string[];
  /** Created timestamp */
  createdAt?: string;
  /** Last modified timestamp */
  updatedAt?: string;
  /** Creator/organizer ID */
  createdBy?: string;
  /** Whether the meeting is marked as important */
  isPriority?: boolean;
  /** Tags or categories */
  tags?: string[];
  /** Parent meeting ID (for series) */
  seriesId?: string;
}

/**
 * Create Meeting Form Data
 * Data structure for the create/edit meeting form
 */
export interface CreateMeetingFormData {
  /** Meeting title */
  title: string;
  /** Meeting description */
  description?: string;
  /** Selected date */
  date: string;
  /** Selected start time */
  time: string;
  /** Duration in minutes */
  duration: string;
  /** Selected timezone */
  timezone: string;
  /** Whether meeting is recurring */
  recurring: boolean;
  /** Recurrence details if recurring */
  recurrenceConfig?: RecurrenceConfig;
  /** Selected participants */
  participants?: Participant[];
  /** Employee IDs to invite (organizer is added automatically on the server). */
  participantEmployeeIds?: number[];
  /** Meeting location */
  location?: string;
}

/**
 * Meeting List Response
 * Structure for API responses containing multiple meetings
 */
export interface MeetingListResponse {
  /** Array of meetings */
  meetings: Meeting[];
  /** Total number of meetings */
  total: number;
  /** Current page (for pagination) */
  page: number;
  /** Items per page */
  pageSize: number;
  /** Total pages */
  totalPages: number;
  /** Whether there are more results */
  hasMore: boolean;
}


export interface MeetingStats {
  /** Total number of meetings */
  totalMeetings: number;
  /** Number of upcoming meetings */
  upcomingMeetings: number;
  /** Number of completed meetings */
  completedMeetings: number;
  /** Number of canceled meetings */
  canceledMeetings: number;
  /** Average meeting duration */
  averageDuration?: number;
  /** Total meeting hours */
  totalHours?: number;
  /** Most common meeting time */
  peakHour?: string;
}


export interface MeetingFilterOptions {
  /** Filter by status */
  status?: MeetingStatus | MeetingStatus[];
  /** Filter by date range */
  dateRange?: {
    start: string;
    end: string;
  };
  /** Filter by participant */
  participant?: string;
  /** Filter by organizer */
  organizer?: string;
  /** Search query */
  searchQuery?: string;
  /** Filter by tags */
  tags?: string[];
  /** Only priority meetings */
  isPriority?: boolean;
}


export interface MeetingSortOptions {
  /** Field to sort by */
  sortBy: 'date' | 'time' | 'title' | 'participants' | 'status' | 'createdAt';
  /** Sort direction */
  sortOrder: 'asc' | 'desc';
}


export interface MeetingActionResponse {
  /** Whether the action was successful */
  success: boolean;
  /** Response message */
  message: string;
  /** Meeting data if applicable */
  meeting?: Meeting;
  /** Error details if action failed */
  error?: string;
}


export type Timezone = 
  | 'UTC'
  | 'EST'
  | 'CST'
  | 'MST'
  | 'PST'
  | 'GMT'
  | 'IST'
  | 'JST'
  | 'AEST'
  | 'CET'
  | 'AEST'
  | string;

export interface TimeSlot {
  /** Time in HH:MM AM/PM format */
  time: string;
  /** Whether the slot is available */
  isAvailable: boolean;
  /** List of conflicting participants */
  conflicts?: string[];
}

export interface MeetingTemplate {
  /** Template ID */
  id: string;
  /** Template name */
  name: string;
  /** Template description */
  description?: string;
  /** Default meeting duration */
  defaultDuration: number;
  /** Default participants */
  defaultParticipants?: Participant[];
  /** Default location */
  defaultLocation?: string;
  /** Default timezone */
  defaultTimezone?: string;
  /** Meeting agenda template */
  agendaTemplate?: string;
}


export type MeetingExportFormat = 'ics' | 'pdf' | 'csv' | 'json';

export interface MeetingNotification {
  /** Notification ID */
  id: string;
  /** Meeting ID */
  meetingId: string;
  /** Notification type */
  type: 'upcoming' | 'reminder' | 'started' | 'rescheduled' | 'canceled';
  /** When to send notification before meeting (in minutes) */
  minutesBefore?: number;
  /** Notification message */
  message: string;
  /** Whether notification has been sent */
  sent: boolean;
  /** Timestamp of notification */
  createdAt: string;
}


export interface AttendeeSummary {
  /** Total number of attendees */
  total: number;
  /** Number of confirmed attendees */
  confirmed: number;
  /** Number of pending responses */
  pending: number;
  /** Number of declined attendees */
  declined: number;
  /** List of attendees by status */
  byStatus: {
    confirmed: Participant[];
    pending: Participant[];
    declined: Participant[];
  };
}


export interface MeetingPreferences {
  /** Default meeting duration */
  defaultDuration: number;
  /** Default timezone */
  defaultTimezone: Timezone;
  /** Default meeting provider */
  defaultProvider?: 'zoom' | 'google-meet' | 'teams';
  /** Enable notifications */
  enableNotifications: boolean;
  /** Reminder time in minutes before meeting */
  reminderMinutes: number;
  /** Working hours (for availability checking) */
  workingHours?: {
    start: string; // HH:MM
    end: string;   // HH:MM
  };
  /** Days off (dates when no meetings should be scheduled) */
  daysOff?: string[];
}


export interface PaginatedMeetings {
  /** Array of meetings */
  data: Meeting[];
  /** Pagination information */
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface MeetingConflict {
  /** First conflicting meeting */
  meeting1: Meeting;
  /** Second conflicting meeting */
  meeting2: Meeting;
  /** Conflicting participants */
  conflictingParticipants: Participant[];
  /** Severity level */
  severity: 'low' | 'medium' | 'high';
  /** Conflict description */
  description: string;
}


export interface MeetingAnalytics {
  /** Total meetings this period */
  totalMeetings: number;
  /** Completion rate percentage */
  completionRate: number;
  /** Average attendees per meeting */
  avgAttendees: number;
  /** Most busy day */
  busiestDay: string;
  /** Most busy time */
  busiestTime: string;
  /** Total hours in meetings */
  totalHours: number;
  /** Meeting trend data */
  trend: {
    period: string;
    count: number;
  }[];
}