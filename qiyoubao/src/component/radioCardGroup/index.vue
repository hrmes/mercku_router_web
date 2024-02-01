<template>
  <div class="qiyou-radio-card-group-container"
       :class="`${direction}`">
    <div class="option"
         @click="check(option)"
         :class="{'selected':selected===option.value}"
         v-for="option in options"
         :key="option.value">
      <div class="radio"></div>
      <div class="text-container">
        <div class="mode"> {{option.text}}</div>
        <p v-if="option.description"
           class="des">{{option.description}}</p>
      </div>
      <div v-if="option.img"
           class="icon">
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
.qiyou-radio-card-group-container {
  width: 400px;
  display: grid;
  grid-row-gap: 10px;
  grid-column-gap: 10px;
  &.vertical {
    grid-template-rows: repeat(auto-fill, 55px);
    grid-template-columns: repeat(2, 1fr);
    .option {
      height: 55px;
    }
  }
  &.horizontal {
    grid-template-rows: repeat(1fr, auto);
    grid-template-columns: 100%;
    .option {
      height: 100%;
    }
  }
  .option {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-radius: 10px;
    padding-left: 12px;
    color: var(--text_default-color);
    background-color: var(--header-bgc);
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    &.selected {
      color: var(--radio_selected-border-color);
      background-color: var(--radio_card_item_selected-color);
      .radio {
        position: relative;
        border: 1.5px solid var(--radio_selected-border-color);
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--radio_selected-border-color);
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
      margin-left: 12px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 2px;
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
  .qiyou-radio-card-group-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    &.horizontal {
      .option {
        margin-left: 0;
        &:first-child {
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
