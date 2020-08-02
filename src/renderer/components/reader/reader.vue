<template>
    <div class="wrapper">
        <a-drawer @close="onClose" width="300" placement="left" :closable="false" :visible="visible">
            <index-mode :navigation="navigation" :jumpTo="jumpTo"></index-mode>
        </a-drawer>
        <transition name="slide-down">
            <div class="title-wrapper" v-show="ifTitleShow">
                <div class="left">返回</div>
                <div class="right">
                    <div class="icon-wrapper" @click="newPage()">新建</div>
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
                <div class="boot-wrapper-top">
                    <div class="chapter">上一章</div>
                    <div style="width:600px;margin-top:5px">
                        <a-slider id="test" :defaultValue="30" :max="total" :min="0" @change="onLocationChange"
                                  :step="3"/>
                    </div>
                    <div class="chapter">下一章</div>
                </div>
                <div class="boot-wrapper-bottom">
                    <div>
                        <svg @click="showDrawer" class="icon left" aria-hidden="true">
                            <use xlink:href="#icon-mulu"/>
                        </svg>
                    </div>
                    <div>
                        <a-popover trigger="click">
                            <template slot="content">
                                <div class="fontType">
                                    <div style="margin:10px">
                                        字号
                                        <a-button-group>
                                            <a-button @click="changeFontSize(0)">
                                                <a-icon type="left"/>
                                            </a-button>
                                            <a-button @click="changeFontSize(1)">
                                                <a-icon type="right"/>
                                            </a-button>
                                        </a-button-group>
                                    </div>
                                    <div style="margin:10px">
                                        字体
                                        <a-button-group>
                                            <a-button>简体</a-button>
                                            <a-button>繁体</a-button>
                                        </a-button-group>
                                    </div>
                                </div>
                            </template>
                            <div>Aa</div>
                        </a-popover>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import SystemInformation from '../landingPage/SystemInformation'
    import Epub from 'epubjs'
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
                ifTitleShow: false,
                visible: false,
                buttonWidth: 70,
                text: 'Are you sure to delete this task?',
                navigation: {},
                isShowAa: false,
                fontSize: 14,
                locations: {}// 定位
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
            height: 70px;
            z-index: 101;
            background: white;
            display: flex;
            justify-content: center;
            flex-direction: column;
            box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.25);
            .boot-wrapper-top{
                width: 100%;
                height: 40px;
                display: flex;
                padding-top: 10px;
                justify-content: center;
                align-items: center;
                .chapter{
                    font-weight: bold;
                    cursor:pointer;
                    margin-right: 20px;
                    margin-left: 20px;
                }
            }
            .boot-wrapper-bottom{
                width: 100%;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .code-box-demo .ant-slider {
                margin-bottom: 16px;
            }

            .left {
                flex: 0 0 60px;
                width: 35px;
                line-height: 35px;
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
                vertical-align: -0.15em;
                fill: currentColor;
                overflow: hidden;
                color: #e58308;
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

        .ant-drawer-body {
            padding: 0;
        }
    }
</style>
