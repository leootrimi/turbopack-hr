import { z } from "zod";

export const TeamCardSchema = z.object({
  teamId: z.number(),
  teamName: z.string(),
  teamType: z.string().nullable(),
  teamMemberCount: z.number(),
  leaderName: z.string(),
  leaderEmail: z.string().optional(),
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable().optional(),
  description: z.string().optional(),
  department: z.string().optional(),
  members: z.array(z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    email: z.string(),
    role: z.string(),
    avatar: z.string().optional(),
  })).optional()
})

export type TeamCard = z.infer<typeof TeamCardSchema>

export const TeamSelectSchema = z.object({
  teamId: z.number(),
  teamName: z.string(),
  leaderId: z.number(),
  leaderName: z.string(),
});

export type TeamSelect = z.infer<typeof TeamSelectSchema>;