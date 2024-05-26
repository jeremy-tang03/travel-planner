import { Timeline, Text } from '@mantine/core';
import { activities, days } from '../constants';

export default function TimelineReact() {

  const activs = activities.reduce((a, item) => {
    const date = item.date;
    if (!a[date]) {
      a[date] = [];
    }
    a[date].push(item.value);
    return a;
  }, {});
  
  days.map((day) => {
    const key = day.key;
    day.activities = activs[key]
    return day;
  })

  const items = days.map((item) => (
    <Timeline active={0} bulletSize={20} style={{ marginLeft: '0.5em', marginTop: '1.3em'}}>
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