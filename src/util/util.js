export default {
  adapt: (designWidth, rem2px) => {
    const d = window.document.createElement('div');
    d.style.width = '1rem';
    d.style.display = 'none';
    const head = window.document.getElementsByTagName('head')[0];
    head.appendChild(d);
    const defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));
    d.remove();
    document.documentElement.style.fontSize = `${window.innerWidth /
      designWidth *
      rem2px /
      defaultFontSize *
      100}%`;
    const st = document.createElement('style');
    const portrait = `@media screen and (min-width: ${
      window.innerWidth
    }px) {html{font-size:${window.innerWidth / (designWidth / rem2px) / defaultFontSize * 100}%;}}`;
    const landscape = `@media screen and (min-width: ${
      window.innerHeight
    }px) {html{font-size:${window.innerHeight /
      (designWidth / rem2px) /
      defaultFontSize *
      100}%;}}`;
    st.innerHTML = portrait + landscape;
    head.appendChild(st);
    return defaultFontSize;
  }
};
