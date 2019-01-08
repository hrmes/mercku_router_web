<script>
export default {
  props: {
    count: {
      type: Number,
      default: 20
    },
    color: {
      type: String,
      default: '#333'
    },
    size: {
      type: Number,
      default: 40
    }
  },
  render(createElement) {
    const angle = 360 / this.count;
    const gsArray = Array.from(new Array(this.count)).map((_, index) => ({
      x: index * angle,
      y: 50,
      z: 50
    }));
    return createElement(
      'svg',
      {
        attrs: {
          xmlns: 'http://www.w3.org/2000/svg',
          'xmlns:xlink': 'http://www.w3.org/1999/xlink',
          viewBox: '0 0 100 100',
          preserveAspectRatio: 'xMidYMid',
          style: 'background: none;',
          width: `${this.size}`,
          height: `${this.size}`
        }
      },
      gsArray.map(g => createElement(
          'g',
          {
            attrs: {
              transform: `rotate(${g.x} ${g.y} ${g.z})`
            }
          },
          [
            createElement('rect', {
              attrs: {
                x: '48',
                y: '5',
                ry: '1',
                rx: '9.6',
                width: 4,
                height: 10,
                fill: this.color
              }
            })
          ]
        ))
    );
  }
};
</script>


<style lang="scss" scoped>
@keyframes ele-animation {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@function delay($index) {
  @return $index * 0.05s;
}
@for $i from 1 through 20 {
  svg {
    g:nth-child(#{$i}) {
      animation: ele-animation 1s delay($i) linear infinite;
    }
  }
}
</style>
