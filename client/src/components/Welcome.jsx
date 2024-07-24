import { useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, ScrollArea, List, TextInput, Transition } from '@mantine/core';
import { useForm } from '@mantine/form';
import { UserContext } from '../UserProvider';

export default function Welcome({ setCode, setHasCode }) {
  const [opened, { open, close }] = useDisclosure(true);
  const { user, setUser } = useContext(UserContext);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      user: '',
      code: '',
    },
    validate: {
      code: (value) => (value.trim().length < 1 ? 'Code is required' : updateCode(value)),
      user: (value) => (value.length < 0 ? '' : updateUsername(value))
    },
  });

  const updateCode = (value) => {
    setCode(value);
    setHasCode(true);
  }

  const updateUsername = (value) => {
    if (value.length > 0) {
      setUser({name: value});
    } else {
      setUser({name: 'Anonymous'});
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
      <ScrollArea h={150} type="always" offsetScrollbars scrollbarSize={8} scrollbars="y">
        <List>
          <List.Item>Clone or download repository from GitHub</List.Item>
          <List.Item>Install dependencies with yarn</List.Item>
          <List.Item>To start development server run npm start command</List.Item>
          <List.Item>Run tests to make sure your changes do not break the build</List.Item>
          <List.Item>Submit a pull request once you are done</List.Item>
        </List>
      </ScrollArea>
      <form onSubmit={form.onSubmit(close)}>
        <TextInput key={form.key('code')} {...form.getInputProps('code')} label="Code" placeholder="Enter code here" mb="md" data-autofocus />
        <TextInput key={form.key('user')} {...form.getInputProps('user')} label="Username (Optional)" placeholder="Anonymous" mb="md" />
        <Button type="submit">Continue</Button>
      </form>
    </Modal>
  );
}