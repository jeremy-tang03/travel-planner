import { fetchGoogleSheetsData } from 'google-sheets-mapper';

export function getFormattedDays(data) {
  const activities = reduceData(data, "activities");
  const tasks = reduceData(data, "tasks");
  const restaurants = reduceData(data, "restaurants");
  return data.days.map((day) => {
    const key = day.key;
    day.activities = activities[key]
    day.tasks = tasks[key]
    day.restaurants = restaurants[key]
    return day;
  })
}

function reduceData(data, field) {
  return data[field].reduce((a, item) => {
    const date = item.date;
    if (!a[date]) {
      a[date] = [];
    }
    a[date].push(item);
    return a;
  }, {})
}

// inputString being the API key or other, pw being the user input code
// function generateSecret(inputString, pw) {
//   const inputLength = inputString.length;
//   const pwLength = pw.length;
//   let result = '';
//   let indexes = [];
//   for (let i = 0; i < inputLength; i++) {
//     const char = inputString[i];
//     const charCode = char.charCodeAt(0);
//     const keyChar = pw[i % pwLength];
//     const keyCharCode = keyChar.charCodeAt(0);
//     let modifiedCharCode = (charCode + keyCharCode) % 128; // Assuming ASCII range (0-127)
//     if (modifiedCharCode < 33) {
//       modifiedCharCode = modifiedCharCode + 33;
//       indexes.push(i);
//     }
//     const modifiedChar = String.fromCharCode(modifiedCharCode);
//     result += modifiedChar;
//   }
//   return { "result": result, "indexes": indexes };
// }

export function getKey(pw, secret = `,+J"!C&''@8+76=51}$626E#"=r&49/:?3:=s=3`,
  indexes = [0, 1, 6, 7, 14, 15, 18, 20, 25, 27, 28, 30, 31, 32, 35, 37, 38]) {
  const secretLength = secret.length;
  const pwLength = pw.length;
  let key = '';
  for (let i = 0; i < secretLength; i++) {
    const secretChar = secret[i];
    const secretCharCode = secretChar.charCodeAt(0);
    const pwChar = pw[i % pwLength];
    const pwCharCode = pwChar.charCodeAt(0);
    let keyCharCode = (secretCharCode - pwCharCode + 128) % 128;
    if (indexes.includes(i)) {
      keyCharCode = keyCharCode - 33;
    }
    const originalChar = String.fromCharCode(keyCharCode);
    key += originalChar;
  }
  return key;
}

export async function getSheetsData(code, sheet = "") {
  const key = getKey(code);
  const sheetId = getKey(code, `{w*r4"*}4~3-'':;/'1>32}('C/:%@/9,%6/#35D9?;`,
    [6, 13, 15, 16, 18, 24, 26, 28, 29, 31, 32, 34, 35, 37, 39, 41, 43]);
  try {
    let res = await fetchGoogleSheetsData({
      apiKey: key,
      sheetId: sheetId,
    });
    const sheetsData = {};
    res.forEach(sheet => {
      sheetsData[sheet.id.toLowerCase()] = sheet.data;
    });
    return sheetsData;
  } catch (error) {
    // console.error(error);
    return { error: error }
  }
}

export function getBadgeColor(value) {
  if (value.includes("Tokyo")) return "blue";
  else if (value.includes("Kyoto")) return "#777a5b";
  else if (value.includes("Osaka")) return "#9e241e";
  else if (value.includes("Dine in")) return "brown";
  else if (value.includes("Takeout")) return "green";
  else if (value.includes("Delivery")) return "yellow";
  else return "pink";
}

function dateWithoutTimezone(date) {
  const tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
  const withoutTimezone = new Date(date.valueOf() - tzoffset)
    .toISOString()
    .slice(0, -1);
  return withoutTimezone;
};

export function exportEvents(events) {
  return events.map(event => {
    return {
      ...event,
      start: dateWithoutTimezone(event.start),
      end: dateWithoutTimezone(event.end)
    }
  });
}

export function importEvents(events) {
  return events.map(event => {
    let allDay = event.allDay;
    return {
      ...event,
      ...(allDay && {
        allDay: allDay === 'TRUE' ? true : false
      }),
      start: new Date(event.start),
      end: new Date(event.end)
    }
  });
}

function hexToRgb(h) {
  return ['0x' + h[1] + h[2] | 0, '0x' + h[3] + h[4] | 0, '0x' + h[5] + h[6] | 0];
}
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function avgHex(h1, h2) {
  let a = hexToRgb(h1);
  let b = hexToRgb(h2);
  return rgbToHex(~~((a[0] + b[0]) / 2), ~~((a[1] + b[1]) / 2), ~~((a[2] + b[2]) / 2));
}
