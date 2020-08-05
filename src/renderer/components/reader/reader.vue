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
                <div :class="['show-color','white',colorIndex === 1?'choose-color':'']" @click="setColor(1)"/>
                <div :class="['show-color','yellow',colorIndex === 2?'choose-color':'']" @click="setColor(2)"/>
                <div :class="['show-color','green',colorIndex === 3?'choose-color':'']" @click="setColor(3)"/>
                <div :class="['show-color','gray',colorIndex === 4?'choose-color':'']" @click="setColor(4)"/>
                <div :class="['show-color','dark',colorIndex === 5?'choose-color':'']" @click="setColor(5)"/>
                <div class="vertical-line">|</div>
                <div class="show-font-size">字号</div>
                <div class="plus">
                    <a-icon type="plus-circle" @click="changeFontSize(0)"/>
                </div>
                <div class="font-size">{{fontSize}}</div>
                <div class="plus">
                    <a-icon type="plus-circle" @click="changeFontSize(1)"/>
                </div>
                <div class="vertical-line margin-left-10" >|</div>
                <div class="show-font-size">更多设置</div>
                <a-popover  trigger="click">
                    <template slot="content">
                        <div>字体</div>
                        <a-radio-group name="radioGroup" :default-value="1">
                            <a-radio :value="1">
                                黑体
                            </a-radio>
                            <a-radio :value="2">
                                楷体
                            </a-radio>
                            <a-radio :value="3">
                                宋体
                            </a-radio>
                            <a-radio :value="4">
                                苹方
                            </a-radio>
                        </a-radio-group>
                    </template>
                    <div class="setting-ico"><a-icon type="setting" /></div>
                </a-popover>

            </div>
        </div>
        <div class="read-wrapper">
            <div id="read" :class="[bgColor,fontColor]"></div>
            <div class="mask">
                <div class="left" @click="prevPage"></div>
                <div class="center" @click="toggleTitle"></div>
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
                <div class="chapter-font">14/35</div>
                <div class="svg-icon">
                    <svg @click="showDrawer" class="icon left" aria-hidden="true">
                        <use xlink:href="#icon-mulu"/>
                    </svg>
                </div>
                <div class="chapter">
                    <a-icon type="step-backward" title="上一章"/>
                </div>
                <div style="width:600px;margin-top:5px">
                    <a-slider id="test" :defaultValue="30" :max="total" :min="0" @change="onLocationChange"
                              :step="3"/>
                </div>
                <div class="chapter">
                    <a-icon type="step-forward" title="下一章"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SystemInformation from '../landingPage/SystemInformation'
    import Epub from 'epubjs'
    import classNames from 'classnames';
    import indexMode from './indexMode'

    const remote = require('electron').remote;
    const ipcRenderer = require('electron').ipcRenderer;
    const BrowserWindow = remote.BrowserWindow;
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
                fontSize: 14,
                locations: {},// 定位
                book:{},
                bgColor:"white",//背景颜色
                fontColor:"pureBlack",//字体颜色
                colorIndex:1
            }
        },
        mounted() {
            let self = this
            ipcRenderer.on('ping', function (event, arg) {
                self.showEpub(JSON.parse(arg).path);
            });

        },
        methods: {
            newPage() {
                let win = new BrowserWindow({width: 800, height: 600});
                win.loadURL('http://r.qq.com');
                win.on("closed", () => {
                    win = null;
                })
            },
            onLocationChange(index) {
                this.rendition.display(this.locations.cfiFromLocation(index))
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
                    case 1:this.colorIndex = 1;this.bgColor = "white";break;
                    case 2:this.colorIndex = 2;this.bgColor = "yellow";break;
                    case 3:this.colorIndex = 3;this.bgColor = "green";break;
                    case 4:this.colorIndex = 4;this.bgColor = "gray";break;
                    case 5:this.colorIndex = 5;this.bgColor = "dark";break;
                    default:
                }
            },
            // 电子书解析渲染
            showEpub(path) {
                // 生成book
                this.book = new Epub(path)
                // 生成rendition
                this.rendition = this.book.renderTo('read', {
                    width: window.innerWidth,
                    height: window.innerHeight - 10
                })
                // 生成rendition.display电子书
                this.rendition.display()
                this.themes = this.rendition.themes
                this.setFontSize(this.fontSize)
                this.book.ready
                    .then(() => {
                        this.navigation = this.book.navigation
                        return this.book.locations.generate()
                    })
                    .then(result => {
                        this.locations = this.book.locations

                        // this.onLocationChange(1407)
                        // console.log(this.book)
                        this.total = this.locations.total
                        console.log(this.locations)
                        // this.locations = this.book.locations
                        // this.bookAvailable = true
                        // console.log(this.book.pageList.cfiFromPage(2))
                    })
            },
            nextPage() {
                if (this.rendition) {
                    this.rendition.next()
                }
            },
            // 目录跳转
            jumpTo(href) {
                this.rendition.display(href).then(res => {
                    this.closeAllTable()
                })
            },
            // 关闭所有蒙版
            closeAllTable() {
                this.onClose()
                this.toggleTitle()
            },
            prevPage() {
                if (this.rendition) {
                    this.rendition.prev()
                }
            },
            // 切换标题显示
            toggleTitle() {
                this.ifTitleShow = !this.ifTitleShow
            },
            // 改变字体
            changeFontSize(status) {
                if (status === 0) {
                    if (this.fontSize > 12) {
                        // 最小设置字号为12
                        this.fontSize = this.fontSize - 2
                        this.setFontSize(this.fontSize)
                    }
                } else {
                    if (this.fontSize < 24) {
                        // 最小设置字号为24
                        this.fontSize = this.fontSize + 2
                        this.setFontSize(this.fontSize)
                    }
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
            display: flex;
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
            }

            .left {
                flex: 0 0 60px;
                width: 30px;
                line-height: 30px;
                text-align: center;
            }

            .right {
                color: #666666;
                display: flex;
                flex-direction: row;
                font-size: 13px;
                font-family: "微软雅黑";
                font-weight: bolder;
                margin-left: 20px;
                /*width: 100px;*/
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
                    -webkit-touch-callout: none;
                    -webkit-user-select: none;
                    -khtml-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
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
        .ant-drawer-body {
            padding: 0;
        }
    }
</style>
