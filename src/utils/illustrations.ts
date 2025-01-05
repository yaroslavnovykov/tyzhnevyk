let previousIllustration: string | null = null;

const illustrations = [
  '/illustrations/tel.svg',
  '/illustrations/otp.svg',
  '/illustrations/ser.svg'
];

export function getRandomIllustration(): string {
  // Фильтруем предыдущую иллюстрацию, чтобы она не повторялась
  const availableIllustrations = illustrations.filter(ill => ill !== previousIllustration);
  
  // Получаем случайную иллюстрацию из доступных
  const randomIndex = Math.floor(Math.random() * availableIllustrations.length);
  const selectedIllustration = availableIllustrations[randomIndex];
  
  // Сохраняем выбранную иллюстрацию как предыдущую
  previousIllustration = selectedIllustration;
  
  return selectedIllustration;
} 