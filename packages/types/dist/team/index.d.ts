export interface TeamCardProps {
    team: {
        id: number;
        name: string;
        description?: string;
        createdAt: string;
        leaderId?: number | null;
        team_type?: string | null;
    };
}
export interface TeamSelect {
    teamId: number;
    teamName: string;
    leaderId: number;
    leaderName: string;
}
//# sourceMappingURL=index.d.ts.map