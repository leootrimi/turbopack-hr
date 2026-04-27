import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createJob, CreateJobDTO, getJobs } from "../api";

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobDTO) => createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

export function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { getApplications } = await import("../api/index");
      return getApplications();
    },
  });
}

export function useUpdateApplicationStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      const { updateApplicationStage } = await import("../api/index");
      return updateApplicationStage(id, stage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useRejectApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { rejectApplication } = await import("../api/index");
      return rejectApplication(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}

export function useApplyForJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      jobId: string;
      name: string;
      email: string;
      notes?: string;
      cvUrl?: string;
    }) => {
      const { applyForJob } = await import("../api/index");
      return applyForJob(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

