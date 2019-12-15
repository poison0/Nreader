<template>
    <div class="indexModel">
         <!-- <a-menu mode="inline" style="width: 195px;">
            <a-menu-item>菜单项</a-menu-item>
            <a-sub-menu title="子菜单">
            <a-menu-item>子菜单项</a-menu-item>
            </a-sub-menu>
        </a-menu> -->
        <ul v-for="(item) in this.navigation.toc" :key="item.id" class="index">
            {{item.label}}
            <ul v-for="(s) in item.subitems" :key="s.id" class="item">
                {{s.label}}
            </ul>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'index-mode',
    props:{
        navigation:{
            type:Object,
            default:{}
        }
    },
    data(){
        return{

        }
    },
    mounted () {
        console.log(1111)
        console.log(this.navigation)
    },
    mathods:{
        
    }
}
</script>
<style lang="scss" scoped>
.indexModel{
    .ant-drawer-body {
      padding: 0px;
   }
   .index{
       font-size: 16px;
       font-weight: bold;
   }
   .item{
       font-size: 14px;
       font-weight:normal;
       width:100px;
       white-space:nowrap; 
       margin-left: 10px;
   }
}
</style>
