import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { Modal, Button, Flex, TextInput, Textarea, Combobox, useCombobox, ColorInput, TagsInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { useState, useEffect } from 'react';

const groceries = ['🍎 Apples', '🍌 Bananas', '🥦 Broccoli', '🥕 Carrots', '🍫 Chocolate'];

function getRandomHexColor() {
  // Generate a random number between 0 and 255 for each color channel (red, green, blue)
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Convert each color channel to a 2-digit hexadecimal string and concatenate them
  const hex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');

  return hex;
}

function DropDownComboBoxWithColorPicker({ tagInput, setTagInput, colorInput, setColorInput }) {

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
        description="(Optional)"
        placeholder={tagInput.length === 0 ? "Pick a tag or create one (press Enter)" : ""}
        data={groceries}
        value={tagInput}
        onChange={setTagInput}
        maxTags={1}
        maxDropdownHeight={200}
        miw={tagInput.length === 0 ? '100%' : '65%'}
        maw={tagInput.length === 0 ? '100%' : '65%'}
        acceptValueOnBlur={false}
        clearable
      />
      <ColorInput
        label="Tag Color"
        description="Event Color"
        value={colorInput}
        onChange={setColorInput}
        miw={tagInput.length === 0 ? '0%' : '30%'}
        maw={tagInput.length === 0 ? '0%' : '30%'}
        clearable
        style={{ display: tagInput.length === 0 ? 'none' : 'block' }}
        withAsterisk
      />
    </Flex>
  );
}

export default function CalendarModal({ editMode, setEditMode, event, events, setEvents, setUserEdit }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [titleInput, setTitleInput] = useState(event.title ? event.title : '');
  const [startInput, setStartInput] = useState(event.start);
  const [endInput, setEndInput] = useState(event.end);
  const [descInput, setDescInput] = useState(event.desc ? event.desc : '');
  const [startDate, setStartDate] = useState(event.start);
  const [endDate, setEndDate] = useState(event.end);
  const [tagInput, setTagInput] = useState(event.tag ? (Array.isArray(event.tag) ? event.tag : [event.tag]) : []);
  const [colorInput, setColorInput] = useState(event.tag && event.color ? event.color : getRandomHexColor());

  const form = useForm({
    mode: 'uncontrolled',
    validate: {
      title: (value) => (value.trim().length < 1 ? 'Title is required' : null),
      startDate: (value) => (value !== undefined ? 'Start date is required' : null),
      endDate: (value) => (value !== undefined ? 'End date is required' : null),
    },
  });

  useEffect(() => {
    // setStartInput(event.start);
    // setEndInput(event.end);
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
        id: event.id,
        title: titleInput,
        start: startInput,
        end: endInput,
        ...(tagInput.length !== 0 && { tag: tagInput }),
        ...(tagInput.length !== 0 && { color: colorInput }),
        ...(descInput !== '' && { desc: descInput })
      };
    } else if (editMode === 'add') {
      let newId = Math.max(...events.map(event => event.id));
      updatedEvents.push({
        id: ++newId,
        title: titleInput,
        start: startInput,
        end: endInput,
        ...(tagInput.length !== 0 && { tag: tagInput }),
        ...(tagInput.length !== 0 && { color: colorInput }),
        ...(descInput !== '' && { desc: descInput })
      });
    }
    setEvents(updatedEvents);
    setUserEdit(Math.random());
    handleClose();
  }

  return (
    <Modal opened={opened} onClose={handleClose} title={editMode === 'edit' ? "Edit Event" : "Add Event"}>
      <form onSubmit={form.onSubmit(handleSave)}>
        <TextInput
          label="Title"
          key={form.key('title')}
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
            key={form.key('startDate')}
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
            key={form.key('endDate')}
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
        <DropDownComboBoxWithColorPicker tagInput={tagInput} setTagInput={setTagInput} colorInput={colorInput} setColorInput={setColorInput} />
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
          <Button type='submit' miw={'6em'}>{editMode === 'edit' ? 'Save' : 'Add'}</Button>
          <Button onClick={handleClose} miw={'6em'}>Cancel</Button>
        </Flex>
      </form>
    </Modal>
  );
}