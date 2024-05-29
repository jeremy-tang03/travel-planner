import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, ScrollArea, List, TextInput } from '@mantine/core';
import { useField, useForm } from '@mantine/form';

export default function Welcome(props) {
  const [opened, { open, close }] = useDisclosure(true);
  const field = useField({
    initialValue: '',
    validate: (value) => (value.trim().length < 1 ? 'Code is required' : updateCode(value)),
  });
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      code: '',
    },

    validate: {
      code: (value) => (value.trim().length < 1 ? 'Code is required' : updateCode(value)),
    },
  });
  const updateCode = (value) => {
    props.setCode(value);
    props.setHasCode(true);
  }

  return (
    <>
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
        {/* Modal content */}
        <ScrollArea h={150} type="always" offsetScrollbars scrollbarSize={8} scrollbars="y">
          <List>
            <List.Item>Clone or download repository from GitHub</List.Item>
            <List.Item>Install dependencies with yarn</List.Item>
            <List.Item>To start development server run npm start command</List.Item>
            <List.Item>Run tests to make sure your changes do not break the build</List.Item>
            <List.Item>Submit a pull request once you are done</List.Item>
          </List>
        </ScrollArea>
        <form onSubmit={form.onSubmit(() => { })}>
          <TextInput key={form.key('code')} {...form.getInputProps('code')} label="Code" placeholder="Enter code here" mb="md" data-autofocus />
          <Button type="submit">Continue</Button>
        </form>
      </Modal>
    </>
  );
}