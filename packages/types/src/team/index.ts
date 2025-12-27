export interface TeamCardProps {
  team: {
    id: number;
    name: string;
    description?: string; // nullable in schema
    createdAt: string; // timestamp, you can also use Date if you convert it
    leaderId?: number | null; // references employee.id, can be null
    team_type?: string | null; // optional, matches team_type column
  };
}
