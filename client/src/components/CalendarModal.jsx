import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Flex, TextInput, Textarea } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useState, useEffect } from 'react';

export default function CalendarModal({ editMode, setEditMode, event, events, setEvents, setUserEdit }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [titleInput, setTitleInput] = useState('');
  const [startInput, setStartInput] = useState(event.start);
  const [endInput, setEndInput] = useState(event.end);
  const [descInput, setDescInput] = useState('');
  const [startDate, setStartDate] = useState(event.start);
  const [endDate, setEndDate] = useState(event.end);

  useEffect(() => {
    if (editMode === 'edit') {
      setTitleInput(event.title);
      setDescInput(event.desc ? event.desc : '');
    }
    setStartInput(event.start);
    setEndInput(event.end);
    open();
  }, [editMode, open]);

  const handleClose = () => {
    close();
    setTimeout(() => {
      setEditMode(false);
    }, 1000);
  }

  const handleSave = () => {
    if (!editMode) return;

    let updatedEvents = [...events];
    if (editMode === 'edit') {
      updatedEvents[events.findIndex(obj => obj.id === event.id)] = {
        ...event,
        title: titleInput,
        start: startInput,
        end: endInput,
        ...(descInput !== '' && { desc: descInput })
      };
    } else if (editMode === 'add') {
      let newId = Math.max(...events.map(event => event.id));
      updatedEvents.push({
        id: ++newId,
        title: titleInput,
        start: startInput,
        end: endInput,
        ...(descInput !== '' && { desc: descInput })
      });
    }
    setEvents(updatedEvents);
    setUserEdit(Math.random());
    handleClose();
  }
  //TODO: Add colors
  return (
    <Modal opened={opened} onClose={handleClose} title={editMode === 'edit' ? "Edit Event" : "Add Event"}>
      <TextInput
        label="Title"
        withAsterisk
        placeholder="Enter event title"
        value={titleInput}
        onChange={(event) => setTitleInput(event.currentTarget.value)}
        data-autofocus
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
        <Textarea
          label="Description"
          description="(Optional)"
          placeholder="Add a description"
          value={descInput}
          onChange={(event) => setDescInput(event.currentTarget.value)}
          style={{ width: '100%' }}
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
        <Button onClick={handleSave} miw={'6em'}>{editMode === 'edit' ? 'Save' : 'Add'}</Button>
        <Button onClick={handleClose} miw={'6em'}>Cancel</Button>
      </Flex>
    </Modal>
  );
}