<template>
  <div class="wrapper">
    <a-drawer @close="onClose" width="220" placement="left" :closable="false" :visible="visible">
      <index-mode :navigation="navigation"></index-mode>
    </a-drawer>
    <transition name="slide-down">
      <div class="title-wrapper" v-show="ifTitleShow">
        <div class="left">返回</div>
        <div class="right">
          <div class="icon-wrapper">图标</div>
          <div class="icon-wrapper">图标</div>
          <div class="icon-wrapper">图标</div>
        </div>
      </div>
    </transition>
    <div class="read-wrapper">
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="prevPage"></div>
        <div class="center" @click="toggleTitle"></div>
        <div class="right" @click="nextPage"></div>
      </div>
    </div>
    <transition name="slide-down">
      <div class="boot-wrapper" v-show="ifTitleShow">
        <svg  @click="showDrawer" class="icon left" aria-hidden="true">
          <use xlink:href="#icon-mulu"></use>
        </svg>
        <div class="right">
          <div class="icon-wrapper">图标</div>
          <div class="icon-wrapper">图标</div>
          <a-popover  trigger="click" v-model="isShowAa">
            <div class="icon-wrapper">Aa</div>
          </a-popover>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

import SystemInformation from "./LandingPage/SystemInformation";
import Epub from "epubjs";
import indexMode from "./indexMode";
const DOWNLODAD_URL = "src/renderer/components/book/jxyz.epub";
global.Epub = Epub;
export default {
  name: "landing-page",
  components: { SystemInformation, indexMode },
  data() {
    return {
      ifTitleShow: false,
      visible: false,
      buttonWidth: 70,
      text: "Are you sure to delete this task?",
      navigation: {},
      isShowAa: false
    };
  },
  mounted() {
    this.showEpub();
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`);
    },
    showAd() {
      this.isShowAa = !this.isShowAa
    },
    confirm() {
      message.info("Clicked on Yes.");
    },
    // 电子书解析渲染
    showEpub() {
      // 生成book
      this.book = new Epub(DOWNLODAD_URL);
      // 生成rendition
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight - 10
      });
      // 生成rendition.display电子书
      this.rendition.display();
      this.themes = this.rendition.themes;
      this.setFontSize(26);
      this.book.ready
        .then(() => {
          this.navigation = this.book.navigation;
          // console.log(this.navigation)
        })
        .then(result => {
          // this.locations = this.book.locations
          // this.bookAvailable = true
        });
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
      }
    },
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
      }
    },
    // 切换标题显示
    toggleTitle() {
      this.ifTitleShow = !this.ifTitleShow;
    },
    // 切换字号
    setFontSize(size) {
      if (this.themes) {
        this.themes.fontSize(size + "px");
      }
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/global";
.wrapper {
  position: absolute;
  .title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 35px;
    z-index: 101;
    background: white;
    display: flex;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    .left {
      flex: 0 0 60px;
      width: 35px;
      line-height: 35px;
      text-align: center;
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .icon-wrapper {
        width: 35px;
        text-align: center;
        line-height: 35px;
        flex: 0 0 40px;
      }
    }
    &.slide-down-enter {
      transform: translate3d(0, -100%, 0);
    }
    &.slide-down-enter-to {
      transform: translate3d(0, 0, 0);
    }
    &.slide-down-enter-active {
      transition: all 0.3s linear;
    }
  }
  .boot-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 35px;
    z-index: 101;
    background: white;
    display: flex;
    box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.25);
    .left {
      flex: 0 0 60px;
      width: 35px;
      line-height: 35px;
      text-align: center;
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .icon-wrapper {
        cursor: pointer;
        width: 35px;
        text-align: center;
        line-height: 35px;
        flex: 0 0 40px;
      }
    }
    &.slide-down-enter {
      transform: translate3d(0, -100%, 0);
    }
    &.slide-down-enter-to {
      transform: translate3d(0, 0, 0);
    }
    &.slide-down-enter-active {
      transition: all 0.3s linear;
    }
    .icon {
      width: 1em;
      height: 1em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
      color:#E58308;
      font-size: 25px;
    }
  }
  .read-wrapper {
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      height: 100%;
      z-index: 100;
      .left {
        flex: 0 0 100px;
      }
      .center {
        flex: 1;
      }
      .right {
        flex: 0 0 100px;
      }
    }
  }
}
</style>
