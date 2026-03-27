import React from 'react'
import MeetingsPage from '../../../../features/meetings/meetings-page'
import ParticipantsCalendarPage from '../../../../features/meetings/calendar/components/calendar-page'
import CalendarPage from '../../../../features/meetings/calendar/calendar-page'

const page = () => {
  return (
    <>
    {/* <MeetingsPage /> */}
    <CalendarPage />
    <ParticipantsCalendarPage />
    </>
  )
}

export default page