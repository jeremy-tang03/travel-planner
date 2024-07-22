import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Flex, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useState, useEffect } from 'react';

export default function CalendarModal({ editMode, setEditMode, event, events, setEvents }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [titleInput, setTitleInput] = useState(event.title);
  const [startInput, setStartInput] = useState(event.start) //useState(event.start.toJSON());
  const [endInput, setEndInput] = useState(event.end) //useState(event.end.toJSON());
  const [startDate, setStartDate] = useState(event.start);
  const [endDate, setEndDate] = useState(event.end);

  useEffect(() => {
    if (editMode) {
      setTitleInput(event.title);
      setStartInput(event.start);
      setEndInput(event.end);
      open();
    }
  }, [editMode, open]);

  const handleClose = () => {
    close();
    setEditMode(false);
  }

  const handleSave = () => {
    let updatedEvents = events;
    updatedEvents[events.findIndex(obj => obj.id === event.id)] = {
      ...event,
      title: titleInput,
      start: startInput,
      end: endInput
    };
    console.log(updatedEvents);
    setEvents(updatedEvents);
    // this is more for add
    // setEvents((prev) => ([
    //   ...prev,
    //   {title: titleInput,
    //   start: startInput,
    //   end: endInput,}
    // ]));
    handleClose();
  }

  return (
    <>
      <Modal opened={opened} onClose={handleClose} title="Edit Event" centered>
        <TextInput
          label="Title"
          withAsterisk
          placeholder="Enter event title"
          value={titleInput}
          onChange={(event) => setTitleInput(event.currentTarget.value)}
        />
        <Flex
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <DateTimePicker
            label="Start"
            withAsterisk
            description="DD/MM/YYYY HH:MM"
            placeholder="Pick date and time"
            value={startInput}
            onChange={setStartInput}
            date={startDate}
            onDateChange={setStartDate}
            mt={'xs'}
            miw={'48%'}
            clearable
          />
          <DateTimePicker
            label="End"
            withAsterisk
            description="DD/MM/YYYY HH:MM"
            placeholder="Pick date and time"
            value={endInput}
            onChange={setEndInput}
            date={endDate}
            onDateChange={setEndDate}
            mt={'xs'}
            miw={'48%'}
            clearable
          />
        </Flex>

        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
          style={{ 'margin': '1.75em 0 0 0' }}
        >
          <Button onClick={handleSave} miw={'6em'}>Save</Button>
          <Button onClick={handleClose} miw={'6em'}>Cancel</Button>
        </Flex>
      </Modal>

    </>
  );
}