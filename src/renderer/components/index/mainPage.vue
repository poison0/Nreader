<template>
  <div id="components-layout-demo-basic">
    <a-layout>
      <a-layout-header>Header</a-layout-header>
      <a-layout>
        <a-layout-sider>Sider</a-layout-sider>
        <a-layout-content>Content</a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import SystemInformation from '../LandingPage/SystemInformation'
// import ePub from 'epubjs'

export default {
  name: 'landing-page',
  components: { SystemInformation },
  data () {
    return {}
  },
  mounted () {
    this.open()
  },
  methods: {
    open () {},
    next () {}
  }
}
</script>

<style>
#components-layout-demo-basic {
  text-align: center;
}
#components-layout-demo-basic .ant-layout-header,
#components-layout-demo-basic .ant-layout-footer {
  background: #dddddd;
  min-height: 40px;
  height: 40px;
  line-height: 40px;
  color: #fff;
}
#components-layout-demo-basic .ant-layout-footer {
  line-height: 1.5;
}
#components-layout-demo-basic .ant-layout-sider {
  background: #fff;
  color: #fff;
  border-right: #dddddd solid 2px;
  line-height: 120px;
}
#components-layout-demo-basic .ant-layout-content {
  background: #fff;
  color: #fff;
  min-height: 480px;
  line-height: 120px;
}
#components-layout-demo-basic > .ant-layout {
  margin-bottom: 48px;
}
#components-layout-demo-basic > .ant-layout:last-child {
  margin: 0;
}
</style>
