export type RequestStatus = "Pending" | "Approved" | "Rejected";
export type RequestType = "Work from home" | "Vacation" | "Sick Leave" | "Personal";
export interface TimeOffRequestRow {
    id: number;
    request_type: RequestType;
    date_from: string;
    date_to: string;
    amount_of_days: number;
    status: RequestStatus;
    created_at: string;
}
export declare const sampleData: TimeOffRequestRow[];
//# sourceMappingURL=index.d.ts.map