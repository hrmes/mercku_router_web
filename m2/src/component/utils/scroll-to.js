export default function (el, x = 0, y = 0) {
  if (el.scrollTo) {
    el.scrollTo(x, y);
  } else {
    el.scrollLeft = x;
    el.scrollTop = y;
  }
}
