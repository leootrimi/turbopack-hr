import React from 'react'
import ParticipantsCalendarPage from '../../../../features/meetings/calendar/components/calendar-page'
import CalendarPage from '../../../../features/meetings/calendar/calendar-page-stats'

const page = () => {
  return (
    <>
    <CalendarPage />
    <ParticipantsCalendarPage />
    </>
  )
}

export default page