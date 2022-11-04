<template>
  <div class="radio-card-group-container"
       :class="`${direction}`">
    <div class="option"
         @click="check(option)"
         :class="{'selected':selected===option.value}"
         v-for="option in options"
         :key="option.value">
      <div class="radio"></div>
      <div class="text-container">
        <div class="mode"> {{option.text}}</div>
        <p class="des">{{option.description}}</p>
      </div>
      <div class="icon">
        <img :src="selected===option.value?option.img.selected:option.img.unselected">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {},
    direction: {
      type: String,
      default: 'horizontal'
    },
    options: Array
  },
  data() {
    return { selected: this.value };
  },
  watch: {
    value(val) {
      this.selected = val;
    }
  },
  methods: {
    check(option) {
      console.log(option);
      this.selected = option.value;
      this.$emit('input', this.selected);
    }
  }
};
</script>
<style lang="scss">
.radio-card-group-container {
  display: flex;
  &.vertical {
    flex-direction: column;
    .option {
      margin-top: 20px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
  &.horizontal {
    .option {
      margin-left: 30px;
      &:first-child {
        margin: 0;
      }
    }
  }
  .option {
    width: 400px;
    height: 130px;
    box-sizing: border-box;
    padding: 10px 15px;
    border-radius: 10px;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
    border: 1.5px solid transparent;
    cursor: pointer;
    transition: all 0.5s;
    &:hover {
      border-color: $radio-card-item-selected-color;
    }
    &.selected {
      background-color: #caedff;
      .radio {
        border-color: $radio-card-item-selected-color;
        position: relative;
        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 7px;
          height: 7px;
          background: $radio-card-item-selected-color;
          border-radius: 50%;
        }
      }
      .text-container {
        .des {
          color: #5d696f;
        }
      }
    }
    .radio {
      width: 15px;
      height: 15px;
      border-radius: 50%;
      border: 1px solid $radio-item-color;
    }
    .text-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      margin: 0 18px 0 12px;
      font-size: 14px;
      user-select: none;
      .mode {
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 5px;
        color: #333;
      }
      .des {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
    .icon {
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      > img {
        widows: 60px;
        height: 60px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .radio-card-group-container {
    display: flex;
    flex-direction: column;
    &.horizontal {
      .option {
        margin-top: 20px;
        margin-left: 0;
        &:first-child {
          margin-top: 0;
        }
      }
    }
    .option {
      width: 340px;
      height: 160px;
      border: 0;
    }
  }
}
@media screen and (max-width: 320px) {
  .radio-card-group-container {
    display: flex;
    flex-direction: column;
    .option {
      width: 240px;
      height: 200px;
      padding: 10px 10px;
      .radio {
        width: 12px;
        height: 12px;
        &::after {
          width: 3px;
          height: 3px;
        }
      }
      .text-container {
        margin: 0 5px;
      }
      .icon {
        > img {
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}
</style>
