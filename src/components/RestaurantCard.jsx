import { Card, Image, Text, Badge, Button, Group, ActionIcon, Center } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { getBadgeColor } from '../helper';

export default function RestaurantCard({ restaurant }) {
  return (
    <Card shadow="sm" padding="sm" radius="md" >
      {/* <Card.Section>
        <Image
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
          height={160}
          alt="Norway"
        />
      </Card.Section> */}

      <Group mt="xs" mb="xs" justify="center">
        {restaurant.options.split(', ').map((elem) => (
          <Badge size="sm" color={getBadgeColor(elem)}>{elem}</Badge>))}
      </Group>

      <Text size="sm">Address</Text>
      <Text size="sm" c="dimmed">
        {restaurant.address}
      </Text>

      <Group mt="xs">
        <Center>
          <Text size="sm" c="dimmed">Open in map</Text>
          <IconExternalLink color="grey" />
        </Center>
      </Group>

    </Card>
  );
}