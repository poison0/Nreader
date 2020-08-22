<template>
    <div class="wrapper">
        <a-drawer @close="onClose" width="300" placement="left" :closable="false" :visible="visible">
            <index-mode :navigation="navigation" :jumpTo="jumpTo"></index-mode>
        </a-drawer>
        <div :class="{
              'title-wrapper': true,
              'fade-in-top': ifTitleShow,
              'fade-out-top': !ifTitleShow
            }"
        >
            <div class="title">NReader</div>
            <div class="right">
                <div class="vertical-line">|</div>
                <div class="color-title">颜色</div>
                <div :class="['show-color','white',setting.bgColor === 1?'choose-color':'']" @click="setColor(1)"/>
                <div :class="['show-color','yellow',setting.bgColor === 2?'choose-color':'']" @click="setColor(2)"/>
                <div :class="['show-color','green',setting.bgColor === 3?'choose-color':'']" @click="setColor(3)"/>
                <div :class="['show-color','gray',setting.bgColor === 4?'choose-color':'']" @click="setColor(4)"/>
                <div :class="['show-color','dark',setting.bgColor === 5?'choose-color':'']" @click="setColor(5)"/>
                <div class="vertical-line">|</div>
                <div class="show-font-size">字号</div>
                <div class="plus">
                    <a-icon type="plus-circle" @click="changeFontSize(0)"/>
                </div>
                <div class="font-size">{{setting.fontSize}}</div>
                <div class="plus">
                    <a-icon type="plus-circle" @click="changeFontSize(1)"/>
                </div>
                <div class="vertical-line margin-left-10" >|</div>
                <div class="show-font-size" style="cursor: pointer;" @click="showModal">更多设置</div>
                <div class="setting-ico"  @click="showModal">
                    <a-icon type="setting" />
                </div>

            </div>
            <div class="right-ico">
                <div v-show="!isFullScreen" class="screen-ico"  @click="maxWindow">
                    <a-icon type="fullscreen" />
                </div>
                <div v-show="isFullScreen" class="screen-ico"  @click="maxWindow">
                    <a-icon type="fullscreen-exit" />
                </div>
            </div>
        </div>
        <div class="read-wrapper">
            <div id="read" :class="[bgColor,fontColor]" :style="'height:'+(pageHeight+10)+'px'"></div>
            <div class="mask">
                <div class="left" @click="prevPage"></div>
                <div class="center" @click="toggleTitle">
                </div>
                <div class="right" @click="nextPage"></div>
            </div>
        </div>

        <div :class="{
              'boot-wrapper': true,
              'fade-in-bottom': ifTitleShow,
              'fade-out-bottom': !ifTitleShow
            }"
        >
            <div class="boot-wrapper-top">
                <div class="chapter-font">{{currentChapter}}/{{totalChapter}}</div>
                <div class="svg-icon">
                    <svg @click="showDrawer" class="icon left" aria-hidden="true">
                        <use xlink:href="#icon-mulu"/>
                    </svg>
                </div>
                <div class="chapter">
                    <a-icon type="step-backward" title="上一页" @click="prevPage"/>
                </div>
                <div style="width:75%;margin-top:5px">
                    <a-slider id="test"  v-model="currentPage" :max="total" :min="0" @change="onLocationChange"
                              :step="1"/>
                </div>
                <div class="chapter">
                    <a-icon type="step-forward" title="下一页" @click="nextPage"/>
                </div>
            </div>
        </div>
        <a-modal
                :visible="settingVisible"
                :confirm-loading="confirmLoading"
                @ok="handleOk"
                @cancel="handleCancel"
                :footer="null"
        >
            <div style="font-weight: bold;margin-bottom:10px">字体</div>
            <a-radio-group name="radioGroup"  :default-value="setting.fontFamily" @change="changeFontFamily">
                <a-radio :value="1">
                    <span style="font-family: '微软雅黑'">黑体</span>
                </a-radio>
                <a-radio :value="2">
                    <span style="font-family: '楷体'">楷体</span>
                </a-radio>
                <a-radio :value="3">
                    <span style="font-family: '宋体'">宋体</span>
                </a-radio>
                <a-radio :value="4">
                    <span style="font-family: '苹方'">苹方</span>
                </a-radio>
                <a-radio :value="5">
                    <span style="font-family: '幼圆'">幼圆</span>
                </a-radio>
            </a-radio-group>
        </a-modal>
    </div>
</template>

<script>
    import SystemInformation from '../landingPage/SystemInformation'
    import Epub from 'epubjs'
    import indexMode from './indexMode'
    import {setSetting,getSetting,setSchedule} from "../util/operDb";
    const remote = require('electron').remote;
    const {app} = require('electron').remote;
    const ipcRenderer = require('electron').ipcRenderer;
    const BrowserWindow = remote.BrowserWindow;
    const path = require('path');
    global.Epub = Epub
    export default {
        name: 'reader',
        components: {SystemInformation, indexMode},
        data() {
            return {
                total: 0,
                ifTitleShow: true,
                visible: false,
                buttonWidth: 70,
                text: 'Are you sure to delete this task?',
                navigation: {},
                isShowAa: false,
                locations: {},// 定位
                book:{},
                bgColor:"white",//背景颜色
                fontColor:"pureBlack",//字体颜色
                ModalText: 'Content of the modal',
                settingVisible: false,
                confirmLoading: false,
                currentPage:0,
                path:"",//书籍地址
                pageHeight: window.innerHeight - 10,
                totalChapter:0, //总章节数
                currentChapter:0, //当前章节数
                isFullScreen:false,
                bookMeta:{},
                setting:{
                    bgColor:1,
                    fontSize:16,
                    fontFamily:1,
                },
                isLoad:true
            }
        },
        created() {
            let self = this
            //监视页面大小变化
            remote.getCurrentWindow().on('resize', (a) => {
                console.log(window.innerHeight)
                self.pageHeight = window.innerHeight -10;
                this.$forceUpdate();
            })
            //监视窗口关闭
            remote.getCurrentWindow().on('close', (a) => {
                this.setSchedule()
                ipcRenderer.send('bookClose', 'success')
            })
        },
        mounted() {
            let self = this

            ipcRenderer.on('ping', function (event, arg) {
                self.bookMeta = JSON.parse(arg)
                console.log(self.bookMeta.schedule)
                if(self.bookMeta.schedule === 0){
                    self.isLoad = false;
                    ipcRenderer.send('asynchronous-message', 'success')
                }

                if(process.env.NODE_ENV !== 'development'){
                    let path = app.getAppPath()+self.bookMeta.path;
                    self.bookMeta.path = path.replace("\\resources\\app.asar.","")
                }
                self.showEpub(self.bookMeta.path);
            });
            let set = getSetting()
            if (set) {
                this.setting = set
            }
        },
        methods: {
            //窗口最大化
            maxWindow() {
                const browserWindow = remote.getCurrentWindow();
                if(!this.isFullScreen){
                    browserWindow.setFullScreen(true)
                    this.isFullScreen = true
                }else{
                    browserWindow.setFullScreen(false)
                    this.isFullScreen = false
                }
            },
            showModal() {
                this.settingVisible = true;
            },
            handleOk(e) {
                this.ModalText = 'The modal will be closed after two seconds';
                this.confirmLoading = true;
                setTimeout(() => {
                    this.settingVisible = false;
                    this.confirmLoading = false;
                }, 2000);
            },
            handleCancel(e) {
                this.settingVisible = false;
            },
            newPage() {
                let win = new BrowserWindow({width: 800, height: 600});
                win.loadURL('http://r.qq.com');
                win.on("closed", () => {
                    win = null;
                })
            },
            //设置进度
            setSchedule(){
                setSchedule(this.bookMeta.id,this.currentPage)
            },
            onLocationChange(index) {
                this.rendition.display(this.locations.cfiFromLocation(index))
            },
            //启动时加载
            onLocationChangeSync(index) {
                ipcRenderer.send('asynchronous-message', 'success')
                this.rendition.display(this.locations.cfiFromLocation(index)).then(()=>{
                    this.syncIndex()
                    console.log("133444")
                })
            },
            handleChange(value) {
                console.log(`selected ${value}`)
            },
            showAd() {
                this.isShowAa = !this.isShowAa
            },
            confirm() {
                message.info('Clicked on Yes.')
            },
            setColor(index){
                switch (index) {
                    case 1:this.setting.bgColor = 1;this.bgColor = "white";break;
                    case 2:this.setting.bgColor = 2;this.bgColor = "yellow";break;
                    case 3:this.setting.bgColor = 3;this.bgColor = "green";break;
                    case 4:this.setting.bgColor = 4;this.bgColor = "gray";break;
                    case 5:this.setting.bgColor = 5;this.bgColor = "dark";break;
                    default:
                }
                setSetting(this.setting)
            },
            // 电子书解析渲染
            showEpub(path) {
                // 生成book
                this.book = new Epub(path)
                // 生成rendition
                this.rendition = this.book.renderTo('read', {
                    width: "100%",
                })

                // 生成rendition.display电子书
                this.rendition.display()
                this.themes = this.rendition.themes
                this.setFontSize(this.setting.fontSize)
                this.setFamily(this.setting.fontFamily)
                this.setColor(this.setting.bgColor)
                this.book.ready
                    .then(() => {
                        this.navigation = this.book.navigation
                        return this.book.locations.generate()
                    })
                    .then(result => {
                        this.locations = this.book.locations
                        this.total = this.locations.total
                        if(this.isLoad){
                            this.onLocationChangeSync(this.bookMeta.schedule)
                        }
                        this.syncIndex();
                    })
            },
            nextPage() {
                if (this.rendition) {
                    this.rendition.next()
                    this.syncIndex()
                }
            },
            // 目录跳转
            jumpTo(href) {
                this.rendition.display(href).then(res => {
                    this.closeAllTable()
                    this.syncIndex()
                })
            },
            //同步进度
            syncIndex(){
                this.currentChapter = this.rendition.currentLocation().end.displayed.page;
                this.totalChapter = this.rendition.currentLocation().end.displayed.total;
                this.currentPage = this.rendition.currentLocation().end.location;
            },
            // 关闭所有蒙版
            closeAllTable() {
                this.onClose()
                this.toggleTitle()
            },
            prevPage() {
                if (this.rendition) {
                    this.rendition.prev()
                    this.syncIndex()
                }
            },
            // 切换标题显示
            toggleTitle() {
                this.ifTitleShow = !this.ifTitleShow
            },
            // 改变字体大小
            changeFontSize(status) {
                if (status === 0) {
                    if (this.setting.fontSize > 12) {
                        // 最小设置字号为12
                        this.setting.fontSize = this.setting.fontSize - 2
                        this.setFontSize(this.setting.fontSize)
                    }
                } else {
                    if (this.setting.fontSize < 24) {
                        // 最小设置字号为24
                        this.setting.fontSize = this.setting.fontSize + 2
                        this.setFontSize(this.setting.fontSize)
                    }
                }
                setSetting(this.setting)
            },
            // 改变字体
            changeFontFamily(status) {
                this.setFamily(status.target.value)
                this.setting.fontFamily = status.target.value
                setSetting(this.setting)
            },
            setFamily(index){
                switch (index) {
                    case 1:this.themes.font("微软雅黑");break;
                    case 2:this.themes.font("楷体");break;
                    case 3:this.themes.font("宋体");break;
                    case 4:this.themes.font("苹方");break;
                    case 5:this.themes.font("幼圆");break;
                }
            },
            // 切换字号
            setFontSize(size) {
                if (this.themes) {
                    this.themes.fontSize(size + 'px')
                }
            },
            // 弹出或关闭修改字号菜单
            changeWordSize() {
            },
            showDrawer() {
                this.visible = true
            },
            onClose() {
                this.visible = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "src/renderer/assets/styles/global";

    .wrapper {
        position: absolute;
        width: 100%;
        .white {
            background-color: #FCFCFC;
        }

        .yellow {
            background-color: #F9F4E9;
        }

        .green {
            background-color: #CEEABA;
        }

        .gray {
            background-color: #6D6D6F;
        }

        .dark {
            background-color: #3B403C;
        }
        .pureBlack {
            color: #000000;
        }
        .margin-left-10{
            margin-left: 10px;
        }
        .title-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 35px;
            z-index: 101;
            background: white;
            /*display: flex;*/
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

            .title {
                color: #FFA400;
                font-family: Calibri, "Times New Roman", serif;
                font-size: 20px;
                font-weight: bolder;
                margin-left: 20px;
                width: 100px;
                height: 35px;
                line-height: 35px;
                float: left;
            }

            .left {
                flex: 0 0 60px;
                width: 30px;
                line-height: 30px;
                text-align: center;
            }
            .right-ico{
                float: right;
                display: flex;
                height: 35px;
                justify-content:center;
                align-items:center;
                margin-right: 20px;
                color: #DDDDDD;
                font-size: 20px;
                .screen-ico{
                    margin-top: 10px;
                    float: right;
                }
                cursor: pointer;
                &:hover {
                    color: #666666;
                }
            }
            .right {
                float: left;
                color: #666666;
                display: flex;
                flex-direction: row;
                font-size: 13px;
                font-family: "微软雅黑";
                font-weight: bolder;
                margin-left: 20px;
                width: 500px;
                height: 35px;
                line-height: 35px;
                align-items: center;

                .vertical-line {
                    margin-right: 7px;
                    color: #DDDDDD;
                }

                .color-title {
                    margin-right: 10px;
                }

                .show-font-size {
                    margin-right: 5px;
                }

                .plus {
                    color: #DDDDDD;
                    cursor: pointer;
                    margin-top: 4px;
                    margin-left: 6px;
                    transition: all 0.2s linear 0s;

                    &:hover {
                        color: #FFA400;
                    }
                }
                .setting-ico{
                    margin-top: 2px;
                    cursor: pointer;
                }

                .font-size{
                    font-weight: normal;
                    margin-left: 6px;
                    /*-webkit-touch-callout: none;*/
                    /*-webkit-user-select: none;*/
                    /*-khtml-user-select: none;*/
                    /*-moz-user-select: none;*/
                    /*-ms-user-select: none;*/
                    /*user-select: none;*/
                }

                .show-color {
                    width: 16px;
                    height: 16px;
                    border-radius: 8px;
                    border: 1px solid #DDDDDD;
                    margin-right: 10px;
                    cursor: pointer;
                    transition: all 0.2s linear 0s;
                    &:hover {
                        border: 1px solid #FFA400;
                    }
                }
                .choose-color{
                    border: 1px solid #FFA400;
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
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 40px;
            z-index: 101;
            background: white;
            display: flex;
            justify-content: center;
            flex-direction: column;
            box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.25);

            .boot-wrapper-top {
                width: 100%;
                height: 30px;
                display: flex;
                padding-top: 5px;
                justify-content: center;
                align-items: center;

                .chapter-font {
                    font-size: 15px;
                    line-height: 30px;
                    margin-right: 15px;
                }

                .svg-icon {
                    cursor: pointer;
                }

                .chapter {
                    font-weight: bold;
                    cursor: pointer;
                    margin-right: 20px;
                    margin-left: 20px;
                }
            }

            /*.boot-wrapper-bottom{*/
            /*    width: 100%;*/
            /*    height: 30px;*/
            /*    display: flex;*/
            /*    justify-content: center;*/
            /*    align-items: center;*/
            /*}*/

            .code-box-demo .ant-slider {
                margin-bottom: 16px;
            }

            .left {
                flex: 0 0 60px;
                width: 30px;
                line-height: 30px;
                text-align: center;
            }

            .fontType {
                display: flex;
                flex-direction: column;
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
                fill: currentColor;
                overflow: hidden;
                color: #666666;
                font-size: 20px;
                margin-top: 2px;
                transition: all 0.2s linear 0s;
                &:hover {
                    color: #FFA400;
                }
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
                    flex: 0 0 200px;
                }

                .center {
                    flex: 1;
                }

                .right {
                    flex: 0 0 200px;
                }
            }
        }
        .ant-drawer-body {
            padding: 0;
        }
    }
</style>
