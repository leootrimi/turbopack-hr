export class CreateTimeOffDto {
  /** Must match an enabled row in `time_off_types`. */
  type!: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  halfDay?: boolean;
  attachmentName?: string;
}
