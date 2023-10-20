export function getShortTime(date) {
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const mins =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${hours}:${mins}`;
}
