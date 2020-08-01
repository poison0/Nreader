<template>
  <div class="indexModel">
    <ul v-for="(item) in this.navigation.toc" :key="item.id" class="index" :title="item.label">
      <div class="firstItem"  @click="jump(item.href)">{{item.label}}</div>
      <ul v-for="(s) in item.subitems" :key="s.id" class="item" :title="s.label">
        <div class="secondItem" @click="jump(s.href)">{{s.label}}</div>
      </ul>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'index-mode',
  props: {
    navigation: {
      type: Object,
      default: {}
    },
    jumpTo: {
      type: Function,
      default: null
    }
  },
  data () {
    return {}
  },
  mounted () {
    console.log(1111)
    console.log(this.navigation)
  },
  methods: {
    jump (href) {
      this.jumpTo(href)
    }
  }
}
</script>
<style lang="scss" scoped>
.indexModel {
  font-family: "微软雅黑";
  .ant-drawer-body {
    padding: 0;
  }
  .firstItem{
    width: 200px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    display: block;
  }
  .firstItem:hover{
    color: #FFA400;
  }

  .secondItem{
    cursor: pointer;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    display: block;
  }
  .secondItem:hover{
      color: #FFA400;
  }
  .index {
    font-size: 16px;
    font-weight: bold;
  }
  .item {
    font-size: 14px;
    font-weight: normal;
    width: 200px;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    margin-left: 10px;
    /*&:hover{*/
    /*  background-color: #F5F5F5;*/
    /*}*/
  }
}
</style>
