<template>
  <div class="model-container">
    <div class="m6a-router">
      <div class="model-img">
        <img src="@/assets/images/img_model_m6a.png"
             alt="">
      </div>
      <div class="router-name">
        <span>
          Merku M6a Router
        </span>
      </div>
      <div class="btn-container">
        <button class=" btn">Choose</button>
      </div>

    </div>
    <div class="other-router">
      <div class="model-img">
        <img src="@/assets/images/img_model_other.png"
             alt="">
      </div>
      <div class="router-name">
        <span>
          Non-Merku M6a Router
        </span>
      </div>
      <div class="btn-container">
        <button class=" btn">Choose</button>
      </div>

    </div>
  </div>
</template>
<script>


export default {

};
</script>
<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.model-container {
  width: 100%;
  flex: auto;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 340px;
    height: 495px;
    background: #f7f7f7;
    border-radius: 10px;
    overflow: hidden;
    &:first-child {
      margin-right: 60px;
    }
    &:hover {
      outline: 2px solid #0e6a99;
    }
    > div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .model-img {
      img {
        width: 240px;
        height: 240px;
      }
    }
    .router-name {
      > span {
        width: auto;
        height: 25px;
        margin: 20px 35px 60px;
        font-family: PingFangSC;
        font-size: 18px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        text-align: center;
        color: #333;
      }
    }
    .btn-container {
      width: 240px;
      .btn {
        width: 240px;
      }
    }
  }
}
@media screen and(max-width: 768px) {
  .model-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > div {
      width: 335px;
      height: 345px;
      margin: 20px 0 20px 0;
      &:first-child {
        margin-right: 0px;
      }
      &:hover {
        outline: none;
      }
      .model-img {
        img {
          width: 155px;
          height: 155px;
        }
      }
      .router-name {
        > span {
          width: auto;
        }
      }
    }
  }
}
</style>
