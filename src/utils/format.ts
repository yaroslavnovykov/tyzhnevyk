export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${minutes} хв`;
  }

  const hoursText = formatHours(hours);
  
  if (remainingMinutes === 0) {
    return hoursText;
  }

  return `${hoursText} ${remainingMinutes} хв`;
}

function formatHours(hours: number): string {
  if (hours === 1) {
    return '1 година';
  }
  
  if (hours < 5) {
    return `${hours} години`;
  }
  
  return `${hours} годин`;
} 