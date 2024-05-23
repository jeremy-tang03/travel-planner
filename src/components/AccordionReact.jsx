import { Accordion } from '@mantine/core';
import { days } from '../constants';

export default function AccordionReact() {
  const items = days.map((item) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion variant="separated">
      {items}
    </Accordion>
  );
}