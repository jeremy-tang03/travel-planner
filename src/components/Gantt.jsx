import React, { useCallback, useEffect } from "react";

import GSTC from "gantt-schedule-timeline-calendar/dist/gstc.wasm.esm.min.js";
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js";
import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js";
import { Plugin as ItemResizing } from "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js";
import { Plugin as ItemMovement } from "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js";
import { Plugin as TimeBookmarks } from 'gantt-schedule-timeline-calendar/dist/plugins/time-bookmarks.esm.min.js';


import "gantt-schedule-timeline-calendar/dist/style.css";
import "../App.css";

let gstc, state;

// helper functions

function generateRows() {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Rows }
   */
  let rows = {};
  let i = 0;
  rows[GSTC.api.GSTCID(i.toString())] = {
    id: i++,
    label: `MTL`,
  };
  rows[GSTC.api.GSTCID(i.toString())] = {
    id: i++,
    label: `Max`,
  };
  rows[GSTC.api.GSTCID(i.toString())] = {
    id: i++,
    label: `Yahsi`,
  };
  rows[GSTC.api.GSTCID(i.toString())] = {
    id: i++,
    label: `Kevin`,
  };
  return rows;
}

function generateItems() {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Items }
   */

  const startY = GSTC.api.date("2024-08-10").startOf("day").add(15, 'hour');
  const start = GSTC.api.date("2024-08-10").startOf("day").add(17, 'hour');
  const startK = GSTC.api.date("2024-08-15").startOf("day").add(15, 'hour');
  const startM = GSTC.api.date("2024-08-19").startOf("day").add(15, 'hour');
  const endK = GSTC.api.date("2024-08-25").startOf("day").add(15, 'hour');
  const endY = GSTC.api.date("2024-08-28").startOf("day").add(13, 'hour');
  const end = GSTC.api.date("2024-09-01").startOf("day").add(16, 'hour');

  const items = {
    [GSTC.api.GSTCID("0")]: {
      id: GSTC.api.GSTCID("0"),
      label: "Jeremy, Tiffany, Hsu, Harris, Ji",
      rowId: GSTC.api.GSTCID("0"),
      time: {
        start: start.valueOf(),
        end: end.valueOf(),
      },
    },
    [GSTC.api.GSTCID("1")]: {
      id: GSTC.api.GSTCID("1"),
      label: "Max",
      rowId: GSTC.api.GSTCID("1"),
      time: {
        start: startM.valueOf(),
        end: end.valueOf(),
      },
    },
    [GSTC.api.GSTCID("2")]: {
      id: GSTC.api.GSTCID("2"),
      label: "Yahsi",
      rowId: GSTC.api.GSTCID("2"),
      time: {
        start: startY.valueOf(),
        end: endY.valueOf(),
      },
    },
    [GSTC.api.GSTCID("3")]: {
      id: GSTC.api.GSTCID("3"),
      label: "Kevin",
      rowId: GSTC.api.GSTCID("3"),
      time: {
        start: startK.valueOf(),
        end: endK.valueOf(),
      },
    },
  };

  return items;
}

function getRandomColor() {
  const colors = ['#E74C3C', '#DA3C78', '#7E349D', '#0077C0', '#07ABA0', '#0EAC51', '#F1892D'];
  return colors[Math.floor(Math.random() * colors.length)];
}

const bookmarks = {
  "Akasaka": {
    time: GSTC.api.date("2024-08-10").startOf("day").add(18, 'hour').valueOf(),
    label: "Akasaka",
    style: {
      background: "#3b518c",
    },
  },
  "Asakusa": {
    time: GSTC.api.date("2024-08-15").startOf("day").add(13, 'hour').valueOf(),
    label: "Asakusa",
    style: {
      background: "#241152",
    },
  },
  "Kyoto": {
    time: GSTC.api.date("2024-08-20").startOf("day").add(13, 'hour').valueOf(),
    label: "Kyoto",
    style: {
      background: "#777a5b",
    },
  },
  "Osaka": {
    time: GSTC.api.date("2024-08-25").startOf("day").add(13, 'hour').valueOf(),
    label: "Osaka",
    style: {
      background: "#9e241e",
    },
  },
  "Tokyo": {
    time: GSTC.api.date("2024-08-28").startOf("day").add(13, 'hour').valueOf(),
    label: "Tokyo",
    style: {
      background: "#3c06ba",
    },
  },
};

// /**
//  * Filter items that have property "frozen" set as true
//  */
// function filterFrozenItems(items) {
//   return items.filter((item) => {
//     if (item.frozen) return false;
//     return true;
//   });
// }

// /**
//  * @type { import("gantt-schedule-timeline-calendar/dist/plugins/item-resizing").Events }
//  */
// const events = {
//   onStart({ items }) {
//     return filterFrozenItems(items.after);
//   },
//   onResize({ items }) {
//     return filterFrozenItems(items.after);
//   },
//   onEnd({ items }) {
//     return filterFrozenItems(items.after);
//   },
// };

// /**
//  * @type { import("gantt-schedule-timeline-calendar/dist/plugins/item-resizing").SnapToTime }
//  */
// const snapToTime = {
//   start({ startTime, time }) {
//     return startTime.startOf(time.period);
//   },
//   end({ endTime, time }) {
//     return endTime.endOf(time.period);
//   },
// };

// /**
//  * @type { import("gantt-schedule-timeline-calendar/dist/plugins/item-resizing").HandleContent }
//  */
// const handleContent = ({ item, vido }) => ({
//   left: vido.html`<div class="resizing-handler-content-left"></div>`,
//   right: vido.html`<div class="resizing-handler-content-right"></div>`,
// });

// /**
//  * @type { import("gantt-schedule-timeline-calendar/dist/plugins/item-resizing").Options }
//  */
// const itemResizingOptions = {
//   events,
//   snapToTime,
//   content: handleContent,
// };

function initializeGSTC(element, isPC) {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Config }
   */
  const config = {
    licenseKey:
      "====BEGIN LICENSE KEY====\nmRDRrc5un9snIrANiwrveUzyOuwafxdINEOzZJ6nSKilPRPL1poq/PvxAwM3oTVLx/0O1dMnQQ+kZICm2RiNDNjjeVQlednUOmiojksVPuQqZaWSwJ4MVCd/9TJ59Ijm8MR936nCZPImujx6rNr47V3NhLgHcXi3Crozri68/BrQzRqO92wyv8L6/7Pxfm7+whWiENwQnoW84w/KqsjMEEHN82/xGj40CQDF5+v5DT+8PFpGaUHjm9CL7cUag5LEMWBlpQ9f9vjT/ZQim+VQdWBQvILZ1eC9vmLbSYD1r8eHHNkdbh+q3EVvB+2QfIkX7oil2QE/G1cVaxMTltIKaw==||U2FsdGVkX1/H7Lqazd24scKO1BBP2t/2+3SyE/VQyogrdr1RjyRQobnDzhOv48d55QXv4IBw9Xfb4h0/XGXpCzubmfD7hawr4hQAvhB9CUA=\nWIPWTea+fgqxLsL0wuPK8U3ySFg3u95gEeVLC4cQSgy7ckBfZNOJHi9t0sUwh5amEm9ARhx9cmsf/jGsyTs3Kw5rPkmmEELk9tm7kWquMBMf1VCxQY1u/3dY/KuPGxPbaiN6raKRpGHQ6l0h1XbUmM/FWoCExhdabg2XksU8CU+6gC8d0rQ2X0qCxa4l9lHb9pgqc3hbEbemxPbCbz7F4SY7sOKbqZYbNajlLH/zr9hypOBeeIzppBUejydevgsC3vaG65jws5o1eQFEccTj08DRfTGje4mxvI7kHtRoox/ByWPV01WFr31yIfl7rVQbDSn0T9UUMdy47KxXBnypBQ==\n====END LICENSE KEY====",
    plugins: [TimelinePointer(), TimeBookmarks({ bookmarks })],
    list: {
      columns: {
        // data: {
        //   [GSTC.api.GSTCID("people")]: {
        //     id: GSTC.api.GSTCID("people"),
        //     width: 60,
        //     data: "label",
        //     header: {
        //       content: "People",
        //     },
        //   },
        // },
      },
      row: {
        height: 50,
      },
      rows: generateRows(),
      toggle: {
        display: false,
      },
    },
    chart: {
      item: {
        gap: {
          top: 16,
        },
      },
      items: generateItems(),
      time: {
        zoom: (isPC ? 20 : 21),
      },
    },
  };

  state = GSTC.api.stateFromConfig(config);

  gstc = GSTC({
    element,
    state,
  });
}

export default function Gantt({ isPC }) {
  const callback = useCallback((element) => {
    if (element) initializeGSTC(element, isPC);
  }, []);

  // useEffect(() => {
  //   return () => {
  //     if (gstc) {
  //       gstc.destroy();
  //     }
  //   };
  // });

  function updateFirstRow() {
    state.update(`config.list.rows.${GSTC.api.GSTCID("0")}`, (row) => {
      row.label = "Changed dynamically";
      return row;
    });
  }

  function changeZoomLevel() {
    state.update("config.chart.time.zoom", 21);
  }

  return (
    <div className="App">
      <div className="toolbox">
        {/* <button onClick={updateFirstRow}>Update first row</button>
        <button onClick={changeZoomLevel}>Change zoom level</button> */}
      </div>
      <div className="gstc-wrapper" ref={callback}></div>
    </div>
  );
}
