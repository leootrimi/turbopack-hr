export class CreateTimeOffDto {
  type: 'Vacation' | 'Work From Home' | 'Sick Leave' | 'Marriage' | 'Bereavement' | 'Unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  halfDay?: boolean;
  attachmentName?: string;
}
