import { useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, ScrollArea, List, TextInput, Transition } from '@mantine/core';
import { useForm } from '@mantine/form';
import { UserContext } from '../UserProvider';

export default function Welcome() {
  const [opened, { open, close }] = useDisclosure(true);
  const { user, setUser } = useContext(UserContext);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      code: '',
    },
    validate: {
      code: (value) => (value.trim().length < 1 ? 'Code is required' : updateUser()),
    },
  });

  const updateUser = () => {
    const { name, code } = form.getValues();
    if (name.length > 0) {
      setUser({ ...user, name, code });
    } else {
      setUser({ ...user, name: 'Anonymous', code });
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={close}
      title="Welcome! Get to know Travel Planner:"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      withCloseButton={false}
      closeOnEscape={false}
      closeOnClickOutside={false}
    >
      <ScrollArea h={135} type="always" offsetScrollbars scrollbarSize={8} scrollbars="y">
        <List>
          Calendar:
          <List.Item>Switch views using tabs at top right</List.Item>
          <List.Item>Go back and forth between dates at top left</List.Item>
          <List.Item>Add: Select time slot or double click</List.Item>
          <List.Item>Edit: Click on event, Edit</List.Item>
          <List.Item>Delete: Click on event, Delete</List.Item>
          <List.Item>Save: top right button, only save when you are ready because it will override previous save</List.Item>
          Known issues:
          <List.Item>Wrong code will crash</List.Item>
          <List.Item>On monthly view, pressing more and dragging event from the popup will crash</List.Item>
          <List.Item>Other features are there but not finished, may crash</List.Item>
        </List>
      </ScrollArea>
      <form onSubmit={form.onSubmit(close)}>
        <TextInput key={form.key('code')} {...form.getInputProps('code')} label="Code" placeholder="Enter code here" mb="md" data-autofocus />
        <TextInput key={form.key('name')} {...form.getInputProps('name')} label="Username (Optional)" placeholder="Anonymous" mb="md" />
        <Button type="submit">Continue</Button>
      </form>
    </Modal>
  );
}