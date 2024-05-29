import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, ScrollArea, List, TextInput } from '@mantine/core';
import { useField } from '@mantine/form';

export default function Welcome(props) {
  const [opened, { open, close }] = useDisclosure(false);
  const field = useField({
    initialValue: '',
    validate: (value) => (value.trim().length < 1 ? 'Code is required' : props.setHasCode(true)),
  });

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
        <TextInput {...field.getInputProps()} label="Code" placeholder="Enter code here" mb="md" />
        <Button onClick={field.validate}>Continue</Button>
      </Modal>

      <Button onClick={open}>Open modal</Button>
    </>
  );
}