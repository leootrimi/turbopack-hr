import { makeRequest } from "../../../lib/axios";
import { JobPost, JobStatus, JobType, JobLocation } from "../components/mock";

export interface JobApiResponse {
  id: number;
  title: string;
  department: string;
  location: string;
  locationType: JobLocation;
  type: JobType;
  salary: string;
  status: JobStatus;
  description: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  applicants: number;
  postedAt: string;
  closedAt: string | null;
}

export type CreateJobDTO = Omit<JobPost, "id" | "postedAt" | "applicants" | "closedAt">;

const mapJob = (job: JobApiResponse): JobPost => ({
  id: String(job.id),
  title: job.title,
  department: job.department,
  location: job.location,
  locationType: job.locationType,
  type: job.type,
  salary: job.salary ?? "",
  status: job.status,
  description: job.description,
  responsibilities: job.responsibilities ?? [],
  requirements: job.requirements ?? [],
  niceToHave: job.niceToHave ?? [],
  applicants: job.applicants ?? 0,
  postedAt: new Date(job.postedAt),
  closedAt: job.closedAt ? new Date(job.closedAt) : undefined,
});

export const getJobs = async () => {
  const jobs = await makeRequest<JobApiResponse[]>({
    url: "/jobs",
    method: "GET",
  });

  return jobs.map(mapJob);
};

export const createJob = async (data: CreateJobDTO) => {
  const job = await makeRequest<JobApiResponse>({
    url: "/jobs",
    method: "POST",
    data,
  });

  return mapJob(job);
};

export const getApplications = async () => {
  return await makeRequest<any[]>({
    url: "api/applications",
    method: "GET",
  });
};

export const updateApplicationStage = async (id: string, stage: string) => {
  return await makeRequest({
    url: `api/applications/${id}/stage`,
    method: "PATCH",
    data: { stage },
  });
};

export const rejectApplication = async (id: string) => {
  return await makeRequest({
    url: `api/applications/${id}/reject`,
    method: "PATCH",
  });
};
