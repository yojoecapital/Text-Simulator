export function isEmoji(text) {
  const regex = /<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu;
  return text.length / 2 === 1 && regex.test(text);
}

export function isWhiteSpace(text) {
  const regex = /^\s*$/;
  return regex.test(text);
}

export function convertToStandardTime(militaryTime) {
  const [hours, minutes] = militaryTime.split(':');
  
  const date = new Date(0, 0, 0, hours, minutes);
  
  let formattedHours = date.getHours() % 12;
  if (formattedHours === 0) {
    formattedHours = 12; // Convert 0 to 12 for standard format
  }
  const formattedMinutes = date.getMinutes().toString().padStart(2, '0');
  
  const suffix = date.getHours() >= 12 ? 'PM' : 'AM';
  if (isNaN(formattedMinutes) || isNaN(formattedHours)) return '12:00 AM';
  return `${formattedHours}:${formattedMinutes} ${suffix}`;
}
  