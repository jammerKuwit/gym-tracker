const USER_NAME = 'Jamin';

/** Morning: 5:00–11:59. Everything else uses Evening (including night). */
export function getGreetingWord() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Morning';
  return 'Evening';
}

export function getGreetingText() {
  return `${getGreetingWord()} ${USER_NAME}`;
}
