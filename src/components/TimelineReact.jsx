import { Timeline, Text } from '@mantine/core';
import * as helper from '../helper';

export default function TimelineReact() {
  const days = helper.getFormattedDays();
  const items = days.map((item) => (
    <Timeline active={0} bulletSize={20} style={{ marginLeft: '0.5em', marginTop: '1.3em' }}>
      <Timeline.Item key={item.value} title={item.value}>
        <Text c="dimmed" size="sm">{item.description}</Text>
      </Timeline.Item>
      {item.activities ?
        item.activities.map((activ) => (
          <Timeline.Item key={activ}>
            <Text c="dimmed" size="sm">{activ}</Text>
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