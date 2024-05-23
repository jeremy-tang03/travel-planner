import { Timeline, Text } from '@mantine/core';
import { days } from '../constants';

export default function TimelineReact() {
  const items = days.map((item) => (
    <Timeline active={0} bulletSize={20} style={{ marginLeft: '0.5em', marginBottom: '0.75em'}}>
      <Timeline.Item key={item.value} title={item.value}>
        <Text c="dimmed" size="sm">{item.description}</Text>
      </Timeline.Item>
      {item.activities ?
        item.activities.map((activ) => (
          <Timeline.Item key={activ.value}>
            <Text c="dimmed" size="sm">{activ.value}</Text>
          </Timeline.Item>
        ))
        : <></>}
    </Timeline>

  ));

  return (
    <>
      {items}
    </>
  );
}