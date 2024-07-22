import React, { Fragment, useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { Modal, Button, Flex, TextInput } from '@mantine/core';
import { default as evs } from './events'
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment-timezone'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import "react-big-calendar/lib/css/react-big-calendar.css";
import MenuContext from './MenuContext'
import CalendarModal from './CalendarModal'
import Event from './Event';
import { getKey, exportEvents } from '../helper';
import { useDirtyContext } from './DirtyContext';

// moment.tz.setDefault('Universal')
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)

export default function DragAndDrop({ pw, data, mousePos, sendJsonMessage, editedEvents }) {
  const { isDirty, setIsDirty } = useDirtyContext();
  const [events, setEvents] = useState(evs);
  const [clicked, setClicked] = useState(false);
  const [view, setView] = useState(Views.MONTH);
  const [showMore, setShowMore] = useState(false);
  const [event, setEvent] = useState({});
  const { defaultDate } = useMemo(() => ({
    defaultDate: new Date(2024, 7, 9)
  }), []);
  const [date, setDate] = useState(defaultDate);
  const [editMode, setEditMode] = useState(false);
  const viewRef = useRef(view);
  const setViewRef = useCallback(data => {
    viewRef.current = data;
    setView(data);
  }, []);
  const [userEdit, setUserEdit] = useState(null);

  useEffect(() => {
    // console.log(data)

    const handleClick = (e) => {
      if ((!e.target.classList.contains('rbc-event-content') && !e.target.classList.contains('rbc-event')
        && !e.target.classList.contains('rbc-event-label')) || viewRef.current === Views.AGENDA) {
        setClicked(false);
        // console.log(selectedDivsRef.current)
        // if (selectedDivsRef.current.length > 0) {
        //   for (let div of selectedDivsRef.current) {
        //     console.log("CL BEF",div.classList);
        //     div.classList.remove("rbc-selected");
        //     console.log("CL AFT",div.classList);

        //   }
        //   // console.log(" MORE THAN 0 ");
        //   setSelectedDivsRef([]);
        // }
      }
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (userEdit) {
      setIsDirty(true);
      sendJsonMessage({
        type: 'contentchange',
        content: JSON.stringify(exportEvents(events)),
      });
    }
  }, [userEdit]);

  useEffect(() => {
    if (editedEvents) {
      setEvents(editedEvents);
    }
  }, [editedEvents]);

  const moveEvent = useCallback(
    ({ event, start, end, isAllDay: droppedOnAllDaySlot = false }) => {
      const { allDay } = event
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true
      }
      if (allDay && !droppedOnAllDaySlot) {
        event.allDay = false;
      }

      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end, allDay: event.allDay }]
      });
      setUserEdit(Math.random());
    },
    [setEvents]
  )

  const resizeEvent = useCallback(
    ({ event, start, end }) => {
      setClicked(false);
      setEvents((prev) => {
        const existing = prev.find((ev) => ev.id === event.id) ?? {}
        const filtered = prev.filter((ev) => ev.id !== event.id)
        return [...filtered, { ...existing, start, end }]
      });
      setUserEdit(Math.random());
    },
    [setEvents]
  )

  const handleSelectSlot = useCallback(
    (event) => {
      if (event.action !== 'click') {
        const title = window.prompt('New Event name')
        if (title) {
          let start = event.start;
          let end = event.end;
          setEvents((prev) => [...prev, { start, end, title }]);
          setUserEdit(Math.random());
        }
      }
    },
    [setEvents]
  )

  const handleSelectEvent = useCallback(
    (event) => {
      setEvent(event);
      setClicked(true);
      // setSelectedDivsRef(document.getElementsByClassName("rbc-selected"));
    }, []
  )

  const handleShowMore = useCallback(
    (event) => {
      setShowMore(true);
    }, []
  )

  const handleView = useCallback(() => {
    console.log(event)
    setClicked(false);
    setDate(new Date(event.start.toJSON()));
    setViewRef(Views.DAY);
  }, [event, setViewRef])

  const handleEdit = () => {
    console.log("EDIT");
    setClicked(false);
    setEditMode(true);
    console.log(event);
  }

  const handleDelete = () => {
    console.log("DELETE");
    let removeIndex = events.map(event => event.id).indexOf(event.id);;
    let newEvents = [...events];
    newEvents.splice(removeIndex, 1);
    setEvents(newEvents);
    setUserEdit(Math.random());
    setClicked(false);
  }

  const handleDoubleClick = useCallback(
    (event) => {
      // console.log(event)
      setEvent(event);
      handleView();
      // console.log("start",event.start)
      // console.log("json",event.start.toJSON())
      // console.log("date",new Date(event.start.toJSON()))
    }, [handleView]
  )

  const handleSaveUpload = async () => {
    const key = getKey(pw, `,-6:1,;/+/6":#A@#):>/31&-w7*q;2'87#A%601,-!"%1%#;0wv$9F$4!26-/>q=As;/7$#C#`,
      [0, 1, 8, 13, 14, 15, 16, 20, 21, 23, 29, 30, 31, 36, 37, 39, 40, 44, 48, 49, 53, 57, 59, 60, 61, 64, 67, 73]);
    const url = `https://script.google.com/macros/s/${key}/exec`;
    await fetch(
      url,
      {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify(exportEvents(events)),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      }).catch(error => console.error(error));
    setIsDirty(false);
  }

  const onView = useCallback((newView) => setViewRef(newView), [setViewRef]);

  return (
    <Fragment>
      <div>
        {editMode && (<CalendarModal
          editMode={editMode}
          setEditMode={setEditMode}
          event={event}
          events={events}
          setEvents={setEvents}
          setUserEdit={setUserEdit}
        />)}
        <MenuContext
          clicked={clicked}
          mousePos={mousePos}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
        <Button
          onClick={handleSaveUpload}
          style={{
            position: 'absolute',
            top: '1px',
            right: '5px'
          }}
        >
          Save
        </Button>
        <DragAndDropCalendar
          defaultDate={defaultDate}
          date={date}
          defaultView={view}
          view={view}
          onView={onView}
          // components={{ event: Event }}
          events={events}
          localizer={localizer}
          onNavigate={setDate}
          onEventDrop={moveEvent}
          onEventResize={resizeEvent}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onDoubleClickEvent={handleDoubleClick}
          onShowMore={handleShowMore}
          onKeyPressEvent={() => { }}
          onDragStart={() => setClicked(false)}
          tooltipAccessor={() => { }}
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