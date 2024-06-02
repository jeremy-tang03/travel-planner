import { Accordion } from '@mantine/core';

export default function AccordionReact({ data }) {
  console.log("data", data)
  const items = data != null && !data.error ? data.days.map((item) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  )) : <div>Data could not be retrieved.</div>;

  return (
    <Accordion variant="separated">
      {items}
    </Accordion>
  );
}