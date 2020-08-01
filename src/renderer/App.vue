<template>
  <div id="app">
      <router-view ></router-view>
  </div>
</template>

<script>
  export default {
    name: 'nreader',
    components: {
    },
    mounted () {
    }
  }
</script>

<style type="text/css" lang="scss">

    //修改全局滚动条
    ::-webkit-scrollbar {
        width: 7px; /*滚动条宽度*/
        height: 2px;  /*滚动条高度*/
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        /*-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);*/
        border-radius: 10px;  /*滚动条的背景区域的圆角*/
        background-color: #ffffff;/*滚动条的背景颜色*/
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        border-radius: 99px; /*滚动条的圆角*/
        /*-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);*/
        background-color: #D6D6D4;  /*滚动条的背景颜色*/
    }
</style>
