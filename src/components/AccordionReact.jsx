import { useState, useEffect } from 'react';
import { Accordion, Group, Badge, ActionIcon, AccordionControlProps, Center } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import { getFormattedDays } from '../helper';
import ComboBox from './ComboBoxReact';
import RestaurantCard from './RestaurantCard';

function AccordionControl(props: AccordionControlProps) {
  return (
    <Center>
      <Accordion.Control {...props} />
      <ActionIcon size="lg" variant="subtle" color="gray">
        <IconDots size="1rem" />
      </ActionIcon>
    </Center>
  );
}

export default function AccordionReact({ data }) {
  const [formattedDays, setFormattedDays] = useState([]);
  const [groupBy, setGroupBy] = useState("");
  const [items, setItems] = useState(<></>);
  const [values, setValues] = useState([]);

  useEffect(() => {
    if (data != null && !data.error) {
      setFormattedDays(getFormattedDays(data));
      setGroupBy("Days");
    }
  }, [data]);

  useEffect(() => {
    switch (groupBy) {
      case "Days":
        setItems(handleGroupByDays(formattedDays));
        break;
      case "Restaurants":
        setItems(handleGroupByRestaurants(data.restaurants));
        break;
      case "Activities":
        setItems(handleGroupByActivities(data.activities));
        break;
      case "Tasks":
        setItems(handleGroupByTasks(data.tasks));
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy])

  function handleGroupByDays(formattedDays) {
    return data != null && !data.error ? formattedDays.map((item) => (
      <Accordion.Item key={item.value} value={item.value}>
        <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
        <Accordion.Panel>
          {item.description}
          {item.tasks ? item.tasks.map((task) => (
            <Accordion.Item key={task.value} value={task.value}>
              <AccordionControl>{task.value}</AccordionControl>
              <Accordion.Panel>
                {task.description}
              </Accordion.Panel>
            </Accordion.Item>
          )) : <></>}
        </Accordion.Panel>
      </Accordion.Item>
    )) : <div>Data could not be retrieved.</div>;
  }

  function handleGroupByRestaurants(restaurants) {
    return data != null && !data.error ? restaurants.map((item) => (
      <Accordion.Item key={item.value} value={item.value}>
        <AccordionControl>
          {item.value}
          <Group mt="xs" mb="xs">
            <Badge color={getBadgeColor(item.address)}>{item.location}</Badge>
            <Badge color="pink">{item.food}</Badge>
            {/* <Badge size="sm" color="pink">Stuff</Badge> */}
          </Group>
        </AccordionControl>
        <Accordion.Panel>
          <RestaurantCard restaurant={item} />
        </Accordion.Panel>
      </Accordion.Item>
    )) : <div>Data could not be retrieved.</div>;
  }

  function getBadgeColor(address){
    if (address.includes("Tokyo")) return "blue";
    else if (address.includes("Kyoto")) return "green";
    else if (address.includes("Osaka")) return "purple";
    else return "pink";
  }

  function handleGroupByActivities(activities) {
    return data != null && !data.error ? activities.map((item) => (
      <Accordion.Item key={item.value} value={item.value}>
        <AccordionControl>{item.value}</AccordionControl>
        <Accordion.Panel>
          {item.description}
        </Accordion.Panel>
      </Accordion.Item>
    )) : <div>Data could not be retrieved.</div>;
  }

  function handleGroupByTasks(tasks) {
    return data != null && !data.error ? tasks.map((item) => (
      <Accordion.Item key={item.value} value={item.value}>
        <AccordionControl>{item.value}</AccordionControl>
        <Accordion.Panel>
          {item.description}
        </Accordion.Panel>
      </Accordion.Item>
    )) : <div>Data could not be retrieved.</div>;
  }

  return (
    <>
      <ComboBox groupBy={groupBy} setGroupBy={setGroupBy} />
      <Accordion multiple value={values} onChange={setValues} variant="separated" chevronPosition="left">
        {items}
      </Accordion>
    </>
  );
}