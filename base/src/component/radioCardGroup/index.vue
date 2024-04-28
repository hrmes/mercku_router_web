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
        <p class="des"
           v-if="option.description">{{option.description}}</p>
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
    display: flex;
    align-items: center;
    height: 100px;
    box-sizing: border-box;
    padding: 10px 15px;
    border-radius: 10px;
    background-color: var(--common_card-bgc);
    cursor: pointer;
    &.selected {
      .radio {
        position: relative;
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 86%;
          height: 86%;
          border-radius: 50%;
          background: var(--primary-color);
        }
      }
    }
    .radio {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 1.5px solid var(--checkbox_border-color);
    }
    .text-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      margin: 0 18px 0 12px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 5px;
      color: var(--text_default-color);
      user-select: none;
      .des {
        margin: 0;
        font-size: 12px;
        color: var(--common_gery-color);
      }
    }
    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: fit-content;
      > img {
        width: 60px;
        aspect-ratio: 1;
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
      background-color: var(--common_sub_card-bgc);
      .icon {
        > img {
          width: 50px;
        }
      }
      .text-container {
        font-size: 12px;
      }
    }
  }
}
@media screen and (max-width: 320px) {
  .radio-card-group-container {
    display: flex;
    flex-direction: column;
    .option {
      height: 120px;
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
        }
      }
    }
  }
}
</style>
