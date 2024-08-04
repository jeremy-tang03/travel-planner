import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Flex, TextInput, Textarea, Combobox, useCombobox, ColorInput, TagsInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useState, useEffect } from 'react';

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];

function DropDownComboBoxWithColorPicker({tagInput, setTagInput}) {

  return (
    <Flex
      gap="md"
      justify="flex-start"
      align="center"
      direction="row"
      wrap="wrap"
      mt={'xs'}
    >

      <TagsInput
        label="Tag"
        placeholder="Pick a tag or create one"
        data={groceries}
        value={tagInput} onChange={setTagInput}
        maxTags={1}
        maxDropdownHeight={200}
        miw={'70%'}
        maw={'70%'}
      />
      <ColorInput
        label="Tag Color"
        defaultValue="#C5D899"
        miw={'25%'}
        maw={'25%'}
      />

    </Flex>
  );
}

export default function CalendarModal({ editMode, setEditMode, event, events, setEvents, setUserEdit }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [titleInput, setTitleInput] = useState('');
  const [startInput, setStartInput] = useState(event.start);
  const [endInput, setEndInput] = useState(event.end);
  const [descInput, setDescInput] = useState('');
  const [startDate, setStartDate] = useState(event.start);
  const [endDate, setEndDate] = useState(event.end);
  const [tagInput, setTagInput] = useState([]);

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
        mt={'xs'}
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
          miw={'47.5%'}
          maw={'47.5%'}
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
          miw={'47.5%'}
          maw={'47.5%'}
          clearable
        />
      </Flex>
      <DropDownComboBoxWithColorPicker tagInput={tagInput} setTagInput={setTagInput} />
      <Textarea
        label="Description"
        description="(Optional)"
        placeholder="Add a description"
        value={descInput}
        onChange={(event) => setDescInput(event.currentTarget.value)}
        style={{ width: '100%' }}
        mt={'xs'}
      />
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