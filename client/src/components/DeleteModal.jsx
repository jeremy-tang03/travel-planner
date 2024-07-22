import { useEffect } from "react";
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Flex, Text, Center } from '@mantine/core';

export default function DeleteModal({ handleDelete, toggleDeleteModal }) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleClose = () => {
    close();
    setTimeout(() => {
      toggleDeleteModal();
    }, 1000);
  }

  const handleCloseDelete = () => {
    handleDelete();
    handleClose();
  }

  useEffect(() => {
    open();
  }, [open]);

  return (
    <Modal opened={opened} onClose={handleClose} withCloseButton={false} centered>
      <Center>
        <Flex justify="center"
          align="center"
          direction="column"
          wrap="wrap"
        >
          <Text size="lg">Are you sure you want to delete this event?</Text>
          <Text size="md">This cannot be undone.</Text>
        </Flex>
      </Center>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="row"
        wrap="wrap"
        style={{'marginTop': '1em'}}
      >
        <Button color="red" onClick={handleCloseDelete}>Delete</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </Flex>
    </Modal>
  );
}