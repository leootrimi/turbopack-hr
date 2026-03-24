import { z } from 'zod';

export type UserFrame = {
    id: string
}

export const LoginBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

export type LoginBody = z.infer<typeof LoginBodySchema>;