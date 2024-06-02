import { Timeline, Text } from '@mantine/core';
import { getFormattedDays } from '../helper';

export default function TimelineReact({ data }) {
  const items = data != null && !data.error ? getFormattedDays(data).map((item) => (
    <Timeline key={item.value} active={0} bulletSize={20} style={{ marginLeft: '0.5em', marginTop: '1.3em' }}>
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
  )) : <div>Data could not be retrieved.</div>;

  return (
    <>
      {items}
    </>
  );
}