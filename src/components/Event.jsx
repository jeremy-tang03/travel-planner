import { HoverCard, Text, Group } from '@mantine/core';

export default function Event(event) {
  let evStart = event.event.start;
  let evEnd = event.event.end;

  const AMPMString = (hours, minutes) => {
    if (hours === 0) {
      return `12:${minutes.toString().padStart(2, "0")}AM`
    }
    else if (hours >= 12) {
      return `${hours === 12 ? hours : hours - 12}:${minutes.toString().padStart(2, "0")}PM`;
    } else {
      return `${hours}:${minutes.toString().padStart(2, "0")}AM`;
    }
  }

  const durationString = () => {
    if (evStart.toDateString() === evEnd.toDateString()) {
      return [`${evStart.toDateString()}`,
      `${AMPMString(evStart.getHours(), evStart.getMinutes())} to ${AMPMString(evEnd.getHours(), evEnd.getMinutes())}`]
    } else {
      return [`${evStart.toDateString()}, ${AMPMString(evStart.getHours(), evStart.getMinutes())} to`,
      `${evEnd.toDateString()}, ${AMPMString(evEnd.getHours(), evEnd.getMinutes())}`];
    }
  }

  return (
    <HoverCard width={250} shadow="md" withArrow openDelay={500} position='top'>
      <HoverCard.Target>
        <div className='rbc-event-content'>
          {event.title}
        </div>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Text size="md" fw={500}>
          {event.title}
        </Text>
        {event.event ? <>
          <Text size="sm">
            {durationString()[0]}
          </Text>
          <Text size="sm">
            {durationString()[1]}
          </Text>
        </> : <></>}
        {event.event.desc ?
          <Text size="sm" style={{marginTop: "0.5em"}}>
            {event.event.desc}
          </Text>
          : <></>}
      </HoverCard.Dropdown>
    </HoverCard>
  )
}