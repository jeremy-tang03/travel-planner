import { activities, days } from './constants';

export function getFormattedDays() {
  const activs = activities.reduce((a, item) => {
    const date = item.date;
    if (!a[date]) {
      a[date] = [];
    }
    a[date].push(item.value);
    return a;
  }, {});

  return days.map((day) => {
    const key = day.key;
    day.activities = activs[key]
    return day;
  })
}

// export function generateSecret(inputString, pw) {
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

export function getApiKey(pw) {
  const secret = `,+J\"!C&''@8+76=51}$626E#\"=r&49/:?3:=s=3`;
  const secretLength = secret.length;
  const pwLength = pw.length;
  let key = '';
  for (let i = 0; i < secretLength; i++) {
    const secretChar = secret[i];
    const secretCharCode = secretChar.charCodeAt(0);
    const pwChar = pw[i % pwLength];
    const pwCharCode = pwChar.charCodeAt(0);
    const indexes = [0, 1, 6, 7, 14, 15, 18, 20, 25, 27, 28, 30, 31, 32, 35, 37, 38]
    let keyCharCode = (secretCharCode - pwCharCode + 128) % 128;
    if (indexes.includes(i)) {
      keyCharCode = keyCharCode - 33;
    }
    const originalChar = String.fromCharCode(keyCharCode);
    key += originalChar;
  }
  return key;
}
