import { TeamCardProps } from '@repo/types';
import { TeamCard } from '../../../teams/components/team-card';
import React from 'react'

const mockTeam: TeamCardProps = {
  team: {
    id: 1,
    name: "Product Design",
    lead: {
      name: "Alice Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    members: 8,
    department: "Design",
    icon: "🎨",
  },
};

const TeamTab = () => {
  return (
    <div className='p-6'>
      <TeamCard team={mockTeam.team} />
    </div>
  )
}

export default TeamTab
