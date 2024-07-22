import { Timeline, Text } from '@mantine/core';
import { getFormattedDays } from '../helper';

export default function TimelineReact({ data }) {
  const items = data != null && !data.error ? getFormattedDays(data).map((item) => (
    <Timeline key={item.value} active={0} bulletSize={20} style={{ marginLeft: '0.5em', marginTop: '1.3em' }}>
      <Timeline.Item key={item.value} title={item.value}>
        <Text c="dimmed" size="sm">{item.description}</Text>
      </Timeline.Item>
      {item.tasks ?
        item.tasks.map((task) => (
          <Timeline.Item key={task.value}>
            <Text c="dimmed" size="sm">{task.value}</Text>
          </Timeline.Item>
        ))
        : <></>}
      {item.activities ?
        item.activities.map((activity) => (
          <Timeline.Item key={activity.value}>
            <Text c="dimmed" size="sm">{activity.value}</Text>
          </Timeline.Item>
        ))
        : <></>}
        {item.restaurants ?
        item.restaurants.map((restaurant) => (
          <Timeline.Item key={restaurant.value}>
            <Text c="dimmed" size="sm">{restaurant.value}</Text>
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