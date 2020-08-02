<template>
  <div class="indexModel">
    <ul v-for="(item) in this.navigation.toc" :key="item.id" class="index" :title="item.label">
      <div class="firstItem"  @click="jump(item.href)">{{item.label}}</div>
      <ul v-for="(s) in item.subitems" :key="s.id" :title="s.label" class="index-second">
        <div class="secondItem" @click="jump(s.href)" >{{s.label}}</div>
        <ul v-for="(t) in s.subitems" :key="t.id" :title="t.label" class="index-three">
          <div class="threeItem" @click="jump(t.href)">{{t.label}}</div>
        </ul>
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
    width: 250px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    overflow:hidden;
    padding-left: 10px;
    text-overflow:ellipsis;
    white-space:nowrap;
    display: block;
    border-bottom: 1px solid #f5f2f0;
    &:hover{
      background-color: #F5F5F5;
    }
  }
  .firstItem:hover{
    color: #FFA400;
  }

  .secondItem{
    font-size: 14px;
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
  .index-three {
    font-size: 12px;
    font-weight: normal;
    width: 250px;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    padding-left: 30px;
    border-bottom: 1px solid #f5f2f0;
    &:hover{
      background-color: #F5F5F5;
    }
  }
  .threeItem{
    cursor: pointer;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    display: block;
    &:hover{
      color: #FFA400;
    }
  }
  .secondItem{
    cursor: pointer;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    display: block;
    font-size: 14px;
    font-weight: normal;
    width: 250px;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    border-bottom: 1px solid #f5f2f0;
    &:hover{
      background-color: #F5F5F5;
    }
  }
}
</style>
