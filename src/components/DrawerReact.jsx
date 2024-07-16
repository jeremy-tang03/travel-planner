import { useState, useEffect } from 'react'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import AccordionReact from './AccordionReact';
import './DrawerReact.css';
import { Rnd } from 'react-rnd';
import { ActionIcon, Burger, SegmentedControl, ScrollArea } from '@mantine/core';
import { IconLock, IconLockOpen } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import TimelineReact from './TimelineReact';

export default function DrawerReact({ data, isPC }) {
    const defWidth = isPC ? 310 : 250;
    const [isOpen, setIsOpen] = useState(false);
    const toggleDrawer = () => {
        if (x + (width / 2) < window.innerWidth / 2) {
            setDirection('left');
        } else {
            setDirection('right');
        }
        if (!isOpen) setClassName('');
        setIsOpen(!isOpen);
    };
    const [width, setWidth] = useState(0);
    const [x, setX] = useState(0);
    // const [y, setY] = useState(0);
    const [tempWidth, setTempWidth] = useState(0);
    const [duration, setDuration] = useState(300);
    const [direction, setDirection] = useState('left');
    const [className, setClassName] = useState('');
    const [draggable, setDraggable] = useState(false);
    const [opened, { toggle }] = useDisclosure();
    const [controlValue, setControlValue] = useState('Cards');

    useEffect(() => {
        if (isOpen) {
            if (x + (width / 2) > window.innerWidth / 2) setX(x - tempWidth);
            setWidth(tempWidth === 0 ? defWidth : tempWidth);
        } else {
            if (x + (width / 2) > window.innerWidth / 2) setX(x + width);
            setTempWidth(width);
            setWidth(0);
            setTimeout(() => setClassName('hidden'), 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen])

    return (
        <>
            <ActionIcon.Group className={!isPC ? "top-left-drawer" : "top-left"}>
                <ActionIcon variant="subtle" color="gray" size="lg" aria-label="Settings">
                    <Burger size="sm" opened={opened} onClick={() => { toggle(); toggleDrawer() }} aria-label="Toggle navigation" />
                </ActionIcon>
                {!isPC ? isOpen ? <ActionIcon variant="subtle" color="rgba(50, 50, 50, 1)" size="lg" aria-label="Settings" onClick={() => setDraggable(!draggable)}>
                    {draggable ? <IconLockOpen style={{ width: '60%', height: '60%' }} stroke={1.5} /> :
                        <IconLock style={{ width: '60%', height: '60%' }} stroke={1.5} />}
                </ActionIcon> : <></> : <></>}
            </ActionIcon.Group>
            <Rnd
                className={className}
                style={{ zIndex: 100 }}
                default={{
                    x: 0,
                    y: 0,
                    width: 0,
                    height: "100%"
                }}
                size={{ width: width, height: "100%" }}
                position={{ x: x, y: 0 }}
                onDragStop={(e, d) => {
                    setX(d.x);
                }}
                disableDragging={!draggable}
                onResize={(e, direction, ref, delta, position) => {
                    setWidth(ref.offsetWidth);
                    setX(position.x);
                }}
                onResizeStart={(e, dir, ref) => setDuration(0)}
                onResizeStop={(e, dir, ref, delta, position) => setDuration(300)}
                enableResizing={draggable ? { top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false } : false}
                dragAxis='x'
                bounds="window"
            >
                {isPC ? isOpen ? <ActionIcon.Group className="top-left-drawer">
                    <ActionIcon variant="subtle" color="gray" size="lg" aria-label="Settings">
                        <Burger size="sm" opened={opened} onClick={() => { toggle(); toggleDrawer() }} aria-label="Toggle navigation" />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="rgba(50, 50, 50, 1)" size="lg" aria-label="Settings" onClick={() => setDraggable(!draggable)}>
                        {draggable ? <IconLockOpen style={{ width: '60%', height: '60%' }} stroke={1.5} /> :
                            <IconLock style={{ width: '60%', height: '60%' }} stroke={1.5} />}
                    </ActionIcon>
                </ActionIcon.Group> : <></> : <></>}
                <Drawer
                    open={isOpen}
                    onClose={toggleDrawer}
                    direction={direction}
                    className='scrollable'
                    enableOverlay={false}
                    size={width}
                    duration={duration}
                >
                    <ScrollArea h={window.innerHeight} type="hover" offsetScrollbars scrollbarSize={8}>
                        <h2 className='head'>Japan 2024</h2>
                        {/* <SegmentedControl
                            fullWidth
                            value={controlValue}
                            onChange={setControlValue}
                            data={['Cards', 'Timeline']}
                            className='segmentControl'
                        /> */}
                        {controlValue === 'Cards' ? <AccordionReact data={data} /> : <TimelineReact data={data} />}
                    </ScrollArea>

                </Drawer>
            </Rnd>
        </>
    )
}