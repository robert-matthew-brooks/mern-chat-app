export default function fillScreen() {
  document.documentElement.style.setProperty(
    '--full-screen-height',
    `${window.innerHeight}px`
  );
}
