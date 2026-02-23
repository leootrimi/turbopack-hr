import { z } from "zod";
export const TeamCardSchema = z.object({
    teamId: z.number(),
    teamName: z.string(),
    teamType: z.string().nullable(),
    teamMemberCount: z.number(),
    leaderName: z.string(),
    createdAt: z.date().nullable()
});
export const TeamSelectSchema = z.object({
    teamId: z.number(),
    teamName: z.string(),
    leaderId: z.number(),
    leaderName: z.string(),
});
