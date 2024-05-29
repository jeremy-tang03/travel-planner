import React, { useCallback, useEffect } from "react";

import GSTC from "gantt-schedule-timeline-calendar/dist/gstc.wasm.esm.min.js";
import { Plugin as TimelinePointer } from "gantt-schedule-timeline-calendar/dist/plugins/timeline-pointer.esm.min.js";
import { Plugin as Selection } from "gantt-schedule-timeline-calendar/dist/plugins/selection.esm.min.js";
import { Plugin as ItemResizing } from "gantt-schedule-timeline-calendar/dist/plugins/item-resizing.esm.min.js";
import { Plugin as ItemMovement } from "gantt-schedule-timeline-calendar/dist/plugins/item-movement.esm.min.js";

import "gantt-schedule-timeline-calendar/dist/style.css";
import "../App.css";

let gstc, state;

// helper functions

function generateRows() {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Rows }
   */
  const rows = {};
  for (let i = 0; i < 100; i++) {
    const id = GSTC.api.GSTCID(i.toString());
    rows[id] = {
      id,
      label: `Row ${i}`,
    };
  }
  return rows;
}

function generateItems() {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Items }
   */
  const items = {};
  // @ts-ignore
  let start = GSTC.api.date("2024-08-09").startOf("day");
  for (let i = 0; i < 100; i++) {
    const id = GSTC.api.GSTCID(i.toString());
    const rowId = GSTC.api.GSTCID(Math.floor(Math.random() * 100).toString());
    start = start.add(1, "day");
    items[id] = {
      id,
      label: `Item ${i}`,
      rowId,
      time: {
        start: start.valueOf(),
        end: start.add(1, "day").endOf("day").valueOf(),
      },
    };
  }
  return items;
}

function initializeGSTC(element) {
  /**
   * @type { import("gantt-schedule-timeline-calendar").Config }
   */
  const config = {
    licenseKey:
      "====BEGIN LICENSE KEY====\nmRDRrc5un9snIrANiwrveUzyOuwafxdINEOzZJ6nSKilPRPL1poq/PvxAwM3oTVLx/0O1dMnQQ+kZICm2RiNDNjjeVQlednUOmiojksVPuQqZaWSwJ4MVCd/9TJ59Ijm8MR936nCZPImujx6rNr47V3NhLgHcXi3Crozri68/BrQzRqO92wyv8L6/7Pxfm7+whWiENwQnoW84w/KqsjMEEHN82/xGj40CQDF5+v5DT+8PFpGaUHjm9CL7cUag5LEMWBlpQ9f9vjT/ZQim+VQdWBQvILZ1eC9vmLbSYD1r8eHHNkdbh+q3EVvB+2QfIkX7oil2QE/G1cVaxMTltIKaw==||U2FsdGVkX1/H7Lqazd24scKO1BBP2t/2+3SyE/VQyogrdr1RjyRQobnDzhOv48d55QXv4IBw9Xfb4h0/XGXpCzubmfD7hawr4hQAvhB9CUA=\nWIPWTea+fgqxLsL0wuPK8U3ySFg3u95gEeVLC4cQSgy7ckBfZNOJHi9t0sUwh5amEm9ARhx9cmsf/jGsyTs3Kw5rPkmmEELk9tm7kWquMBMf1VCxQY1u/3dY/KuPGxPbaiN6raKRpGHQ6l0h1XbUmM/FWoCExhdabg2XksU8CU+6gC8d0rQ2X0qCxa4l9lHb9pgqc3hbEbemxPbCbz7F4SY7sOKbqZYbNajlLH/zr9hypOBeeIzppBUejydevgsC3vaG65jws5o1eQFEccTj08DRfTGje4mxvI7kHtRoox/ByWPV01WFr31yIfl7rVQbDSn0T9UUMdy47KxXBnypBQ==\n====END LICENSE KEY====",
    plugins: [TimelinePointer(), Selection(), ItemResizing(), ItemMovement()],
    list: {
      columns: {
        data: {
          // [GSTC.api.GSTCID("id")]: {
          //   id: GSTC.api.GSTCID("id"),
          //   width: 60,
          //   data: ({ row }) => GSTC.api.sourceID(row.id),
          //   header: {
          //     content: "ID",
          //   },
          // },
          [GSTC.api.GSTCID("label")]: {
            id: GSTC.api.GSTCID("label"),
            width: 60,
            data: "label",
            header: {
              content: "Label",
            },
          },
        },
      },
      rows: generateRows(),
    },
    chart: {
      items: generateItems(),
    },
  };

  state = GSTC.api.stateFromConfig(config);

  gstc = GSTC({
    element,
    state,
  });
}

function Gantt() {
  const callback = useCallback((element) => {
    if (element) initializeGSTC(element);
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

export default Gantt;