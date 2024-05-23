import { useState, useEffect } from 'react'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import AccordionReact from './AccordionReact';
import './DrawerReact.css';
import { Rnd } from 'react-rnd';

const defWidth = 250;

export default function DrawerReact() {
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
            <button onClick={toggleDrawer}>Show</button>
            <Rnd
                className={className}
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
                onResize={(e, direction, ref, delta, position) => {
                    setWidth(ref.offsetWidth);
                    setX(position.x);
                }}
                onResizeStart={(e, dir, ref) => setDuration(0)}
                onResizeStop={(e, dir, ref, delta, position) => setDuration(300)}
                enableResizing={{ top: false, right: true, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
                dragAxis='x'
                bounds="window"
            >
                <Drawer
                    open={isOpen}
                    onClose={toggleDrawer}
                    direction={direction}
                    className='scrollable'
                    enableOverlay={false}
                    size={width}
                    duration={duration}
                >
                    <AccordionReact />
                </Drawer>
            </Rnd>
        </>
    )
}