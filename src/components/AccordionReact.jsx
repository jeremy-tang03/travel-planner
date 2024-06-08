import { useState, useEffect } from 'react';
import { Accordion } from '@mantine/core';
import { getFormattedDays } from '../helper';
import ComboBox from './ComboBoxReact';

export default function AccordionReact({ data }) {
  const [groupBy, setGroupBy] = useState("Days");
  const [items, setItems] = useState();

  useEffect(() => {
    if (data != null && !data.error) {
      const formattedDays = getFormattedDays(data);
      const accordionItems = handleGroupByDays(formattedDays);
      setItems(accordionItems);
    }
  }, [data]);

  function handleGroupByDays(formattedDays){
    return data != null && !data.error ? formattedDays.map((item) => (
      <Accordion.Item key={item.value} value={item.value}>
        <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
        <Accordion.Panel>
          {item.description}
          {item.tasks ? item.tasks.map((task) => (
            <Accordion.Item key={task.value} value={task.value}>
              <Accordion.Control>{task.value}</Accordion.Control>
              <Accordion.Panel>
                {task.description}
              </Accordion.Panel>
            </Accordion.Item>
          )) : <></>}
        </Accordion.Panel>
      </Accordion.Item>
    )) : <div>Data could not be retrieved.</div>;
  }

  function handleGroupbyRestaurants(restaurants){
    return data != null && !data.error ? restaurants.map((item) => (
      <Accordion.Item key={item.value} value={item.value}>
        <Accordion.Control>{item.value}</Accordion.Control>
        <Accordion.Panel>
          {item.description}
          {item.tasks ? item.tasks.map((task) => (
            <Accordion.Item key={task.value} value={task.value}>
              <Accordion.Control>{task.value}</Accordion.Control>
              <Accordion.Panel>
                {task.description}
              </Accordion.Panel>
            </Accordion.Item>
          )) : <></>}
        </Accordion.Panel>
      </Accordion.Item>
    )) : <div>Data could not be retrieved.</div>;
  }

  return (
    <>
      <ComboBox groupBy={groupBy} setGroupBy={setGroupBy} />
      <Accordion multiple variant="separated">
        {items}
      </Accordion>
    </>
  );
}