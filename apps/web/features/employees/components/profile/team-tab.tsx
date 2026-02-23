
import React from 'react'
import { useTeamEmployee } from '../../../teams/hooks/queries';
import { TeamCardComponent } from '../../../teams/components/team-card';

const TeamTab = () => {
  const { data } = useTeamEmployee(1)
  return (
    <div className='p-6'>
      {data && <TeamCardComponent team={data} />}
    </div>
  )
}

export default TeamTab
