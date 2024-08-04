import React, { Fragment, useCallback, useMemo, useState, useEffect, useRef, useContext } from 'react'
import { Modal, Button, Flex, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment-timezone'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.scss'
import "react-big-calendar/lib/css/react-big-calendar.css";
import MenuContext from './MenuContext'
import CalendarModal from './CalendarModal'
import DeleteModal from './DeleteModal';
import Event from './Event';
import useWebSocket from 'react-use-websocket';
import { getKey, exportEvents, avgHex } from '../helper';
import { useDirtyContext } from './DirtyContext';
import { UserContext } from '../UserProvider';
import { DataContext } from '../DataProvider';

// moment.tz.setDefault('Universal')
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(Calendar)

export default function DragAndDrop({ mousePos, sendJsonMessage, editedEvents, saved }) {
  const { isDirty, setIsDirty } = useDirtyContext();
  const { user } = useContext(UserContext);
  const { data, setData } = useContext(DataContext);
  const [events, setEvents] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [view, setView] = useState(Views.MONTH);
  const [showMore, setShowMore] = useState(false);
  const [event, setEvent] = useState({});
  const { defaultDate } = useMemo(() => ({
    defaultDate: new Date(2024, 7, 9)
  }), []);
  const [date, setDate] = useState(defaultDate);
  const [editMode, setEditMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const viewRef = useRef(view);
  const setViewRef = useCallback(data => {
    viewRef.current = data;
    setView(data);
  }, []);
  const [userEdit, setUserEdit] = useState(null);
  const [loading, { toggle }] = useDisclosure();
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [userSaved, setUserSaved] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    if (saveDisabled && userSaved) {
      toggle();
      setUserSaved(false);
    }
  }, [saveDisabled])

  useEffect(() => {
    if (saved > 0) timeoutSave();
  }, [saved]);

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
        setEvent(event);
        setEditMode('add');
      }
    }, []
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
    setClicked(false);
    setEditMode('edit');
  }

  const handleDelete = () => {
    let removeIndex = events.map(event => event.id).indexOf(event.id);;
    let newEvents = [...events];
    newEvents.splice(removeIndex, 1);
    setEvents(newEvents);
    setUserEdit(Math.random());
    setClicked(false);
  }

  const toggleDeleteModal = () => {
    setDeleteModal((prev) => !prev);
  }

  const handleDoubleClick = useCallback(
    (event) => {
      setEvent(event);
      handleView();
    }, [handleView]
  )

  const timeoutSave = () => {
    setSaveDisabled(true);
    setIsDirty(false);
    // Time out save button for 15 secs to prevent spam
    setTimeout(() => {
      setSaveDisabled(false);
    }, 10000);
  }

  // TODO: handle event.tag and event.color
  const handleSaveUpload = async () => {
    toggle();
    setUserSaved(true);
    const key = getKey(user.code, `,-6:1,;/+/6":#A@#):>/31&-w7*q;2'87#A%601,-!"%1%#;0wv$9F$4!26-/>q=As;/7$#C#`,
      [0, 1, 8, 13, 14, 15, 16, 20, 21, 23, 29, 30, 31, 36, 37, 39, 40, 44, 48, 49, 53, 57, 59, 60, 61, 64, 67, 73]);
    const url = `https://script.google.com/macros/s/${key}/exec`;
    let res = await fetch(
      url,
      {
        redirect: "follow",
        method: "POST",
        body: JSON.stringify(exportEvents(events)),
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      }).catch(error => console.error(error));
    if (res.ok) {
      sendJsonMessage({
        type: 'userevent',
        username: user.name,
        save: true
      });
      timeoutSave();
    }
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
        {deleteModal && (<DeleteModal
          handleDelete={handleDelete}
          toggleDeleteModal={toggleDeleteModal}
        />)}
        <MenuContext
          clicked={clicked}
          mousePos={mousePos}
          handleView={handleView}
          handleEdit={handleEdit}
          handleDelete={toggleDeleteModal}
        />
        <Button
          onClick={handleSaveUpload}
          loading={loading}
          disabled={saveDisabled}
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
          components={{ event: Event }}
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
          eventPropGetter={(event, start, end, isSelected) => {
            let backgroundColor = event.color ? event.color : '#3174ad';
            const darker = '#b0b0b0';
            // if (isSelected) backgroundColor = '#265985';
            if (isSelected) backgroundColor = avgHex(backgroundColor, darker);
            return { style: { backgroundColor } }
          }}
        />
      </div>
    </Fragment>
  )
}
// DragAndDrop.propTypes = {
//   localizer: PropTypes.instanceOf(DateLocalizer),
// }