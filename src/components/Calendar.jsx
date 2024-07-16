import React, { Fragment, useCallback, useMemo, useState } from 'react'
// import PropTypes from 'prop-types'
import events from './events'
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = dayjsLocalizer(dayjs)
const DragAndDropCalendar = withDragAndDrop(Calendar)

export default function DragAndDrop() {
  const [myEvents, setMyEvents] = useState(events)

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }
      if (allDay && !droppedOnAllDaySlot) {
          event.allDay = false;
      }

      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end, allDay: event.allDay }]
      })
    },
    [setMyEvents]
  )

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setMyEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end }]
      })
    },
    [setMyEvents]
  )

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const title = window.prompt('New Event name')
      if (title) {
        setMyEvents((prev) => [...prev, { start, end, title }])
      }
    },
    [setMyEvents]
  )

  const handleSelectEvent = useCallback(
    (event) => {
      console.log(event.start.getDay())
    },
    []
  )

  const defaultDate = useMemo(() => new Date(2024, 7, 9), [])

  return (
    <Fragment>
      <div className="height600">
        <DragAndDropCalendar
          defaultDate={defaultDate}
          defaultView={Views.MONTH}
          events={myEvents}
          localizer={localizer}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          popup
          resizable
          selectable
        />
      </div>
    </Fragment>
  )
}
// DragAndDrop.propTypes = {
//   localizer: PropTypes.instanceOf(DateLocalizer),
// }