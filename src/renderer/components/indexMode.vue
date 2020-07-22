<template>
  <div class="indexModel">
    <ul v-for="(item) in this.navigation.toc" :key="item.id" class="index">
      <div class="firstItem"  @click="jump(item.href)">{{item.label}}</div>
      <ul v-for="(s) in item.subitems" :key="s.id" class="item">
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
  .ant-drawer-body {
    padding: 0;
  }
  .firstItem{
    cursor: pointer;
  }
  .firstItem:hover{
      color: blue;
  }
  .secondItem{
    cursor: pointer;
  }
  .secondItem:hover{
      color: blue;
  }
  .index {
    font-size: 16px;
    font-weight: bold;
  }
  .item {
    font-size: 14px;
    font-weight: normal;
    width: 100px;
    white-space: nowrap;
    margin-left: 10px;
  }
}
</style>
