<template>
    <div class="page">
        <div class="header">
            <div class="title">NReader</div>
        </div>
        <div class="content">
            <div class="-left-content">
                <div class="bottomNav">
                    <div class="bottomDiv">
                        <a-button type="primary" icon="file-search" block @click="getBook">
                            添加图书
                        </a-button>
                    </div>
                </div>
                <div class="bookArea">
                    <div class="titleBar">
                        书架
                    </div>
                    <div class="bookItem" :class="{bookItemChecked:navigation === 0}" @click="chooseLabel(0)">
                        <div class="bookLabel">
                            <a-icon type="read"/>
                            <div class="labelWord">全部图书</div>
                        </div>
                        <div class="strip" :class="{stripChecked:navigation === 0}"></div>
                    </div>
                    <div class="bookItem" :class="{bookItemChecked:navigation === 1}" @click="chooseLabel(1)">
                        <div class="bookLabel">
                            <a-icon type="minus-circle"/>
                            <div class="labelWord">未分类</div>
                        </div>
                        <div class="strip" :class="{stripChecked:navigation === 1}"></div>
                    </div>
                    <div class="bookItem" :class="{bookItemChecked:navigation === 2}" @click="chooseLabel(2)">
                        <div class="bookLabel">
                            <a-icon type="plus-square"/>
                            <div class="labelWord">管理分类</div>
                        </div>
                        <div class="strip" :class="{stripChecked:navigation === 2}"></div>
                    </div>
                </div>
            </div>
            <div class="-right-content">
                <div class="-right-bar">
                    <div class="-right-bar-label">全部图书({{bookNum}})</div>
                    <div class="-right-bar-search">
                        <a-input-search placeholder="书名搜索" size="small" style="width: 200px"/>
                    </div>
                </div>
                <div class="-right-content-book">
                    <div class="-book-item" v-for="book in books">
                        <a-card-grid class="-book-pic" @click="openBook(book)">
                            <div class="info"></div>
                            <img :src="book.url" width="180" />
                        </a-card-grid>
                        <div class="-book-title">{{book.title}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Epub from "epubjs";
    import {isMeta, setMeta, getAllMeta, createBooks} from "../util/operDb";
    import {copyFile} from "../util/operFile";
    const {dialog} = require('electron').remote;
    const {ipcRenderer} = require('electron');
    const BrowserWindow = require('electron').remote.BrowserWindow;

    global.Epub = Epub
    export default {
        name: 'index-mode',
        data() {
            return {
                //导航
                navigation: 0,
                books:[],
                bookNum:0,
            }
        },
        mounted() {
           this.getAllBookInfo()
        },
        methods: {
            getAllBookInfo(){
                let bookItem = getAllMeta();
                if(bookItem){
                    this.books = bookItem;
                    this.bookNum = this.books.length;
                }else{
                    createBooks();
                }
            },
            //获取书籍信息
            getBook() {
                dialog.showOpenDialog(
                    {title: "book", filters: [{name: 'epub', extensions: ['epub', 'EPUB']}]
                    }).then((bookInfo)=>{
                    // 生成book
                    let book = new Epub(bookInfo.filePaths[0]);
                    book.loaded.metadata.then(result=>{
                        console.log(bookInfo)
                        let path = "./books/"+result.identifier+".epub";
                        copyFile(bookInfo.filePaths[0],path,(res)=>{
                            console.log(res)
                        })
                        if (!isMeta(result.identifier)) {
                            this.getCoverURL(book,(res)=>{
                                setMeta(result,res,path);
                                this.getAllBookInfo();
                            });
                        }else{
                            this.openNotification(result.title)
                        }
                    })
                })
            },
            //提示
            openNotification(placement) {
                this.$notification['error']({
                    message: `添加失败`,
                    description:
                        '重复图书 《'+placement+"》",
                    placement:'bottomRight'
                });
            },
            openBook(book){
                ipcRenderer.send('showNewPageWindow', JSON.stringify(book));
            },
            //获取图片
            getCoverURL(book, callback) {
                book.coverUrl().then(function (blobUrl) {
                    var xhr = new XMLHttpRequest();
                    xhr.responseType = 'blob';
                    xhr.onload = function () {
                        var recoveredBlob = xhr.response;
                        var reader = new FileReader();
                        reader.onload = function () {
                            callback && callback(reader.result);
                        };
                        reader.readAsDataURL(recoveredBlob);
                    };
                    xhr.open('GET', blobUrl);
                    xhr.send();
                });
            },
            jump(href) {
                this.jumpTo(href)
            },
            chooseLabel(num) {
                this.navigation = num;
            },
            handleClick(e) {
                console.log('click ', e);
            },

        }
    }
</script>
<style lang="scss" scoped>
    .page {
        width: 100%;
        height: 700px;
        background-color: #EFEFEF;

        .header {
            display: flex;
            flex-direction: row;
            justify-items: center;
            width: 100%;
            height: 40px;
            background-color: #ffffff;
            /*background-color: #FFA400;*/
            box-shadow: 0 0 4px #999999;
            position: relative;
            z-index: 100;

            .title {
                color: #FFA400;
                /*color: #ffffff;*/
                /*color: #FFA400;*/
                font-family: Calibri, "Times New Roman", serif;
                font-size: 20px;
                font-weight: bolder;
                margin-left: 20px;
                width: 100px;
                height: 40px;
                line-height: 40px;
            }
        }

        .content {
            font-family: '华文细黑', 'Courier New', Courier, monospace;
            display: flex;
            flex-direction: row;
            height: 660px;

            .-left-content {
                width: 20%;
                height: 100%;
                border-right: 1px solid #E4E4E4;
                /*box-shadow: 0 0 4px #999999;*/
                z-index: 101;
                .bookArea {
                    .titleBar {
                        color: #999999;
                        font-size: 13px;
                        height: 40px;
                        line-height: 40px;
                        padding-left: 20px;
                        border-bottom: 1px solid #E4E4E4;
                    }

                    .bookItem {
                        cursor: pointer;
                        display: flex;
                        flex-direction: row;
                        line-height: 40px;
                        height: 40px;
                        /*border-bottom: 1px solid #E4E4E4;*/

                        .bookLabel {
                            display: flex;
                            flex-direction: row;
                            padding-left: 20px;
                            width: 98%;

                            .labelWord {
                                width: 100px;
                                margin-left: 6px;
                            }
                        }

                        .strip {
                            width: 5px;
                        }

                        .stripChecked {
                            flex-shrink: 0;
                            /*background-color: #0088FE;*/
                            background-color: #1049A9;
                        }

                        &:hover {
                            background-color: #F5F5F5;
                        }
                    }

                    .bookItemChecked {
                        background-color: #E4E4E4;
                    }
                }

                .bottomNav {
                    width: 100%;
                    height: 50px;
                    display: flex;
                    border-bottom: 1px solid #E4E4E4;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    .bottomDiv {
                        width: 90%;
                    }

                }
            }

            .-right-content {
                width: 80%;
                height: 100%;
                display: flex;
                flex-direction: column;
                background-color: #E4E4E4;

                .-right-bar {
                    flex-shrink: 0;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    height: 40px;
                    background-color: #EFEFEF;
                    /*background-color: #FFA400;*/
                    border-bottom: 1px solid #E4E4E4;
                    box-shadow: 0 0 2px #999999;
                    position: relative;
                    z-index: 99;

                    .-right-bar-label {
                        width: 100px;
                        height: 40px;
                        line-height: 40px;
                        margin-left: 20px;
                    }

                    .-right-bar-search {
                        width: 200px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        margin-right: 30px;
                    }
                }

                .-right-content-book {
                    overflow-y: scroll;
                    display: flex;
                    flex-direction: row;
                    align-content: flex-start;
                    flex-wrap: wrap;
                    /*margin-left: 10px;*/
                    /*margin-top: 10px;*/
                    margin-bottom: 10px;
                    background-color: #ffffff;
                    /*box-shadow: 0 0 4px #FFA400;*/
                    .-book-item {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: center;
                        margin-top:20px;
                        margin-left:30px;
                        min-height: 260px;
                        width: 180px;

                        .-book-title {
                            text-align: center;
                            line-height: 20px;
                            margin-top:20px;
                            margin-bottom:20px;
                            color: #000000;
                            font-family: '苹方';
                            /*font-weight: bold;*/
                            font-size: 14px;
                            min-height: 25px;
                            width: 140px;

                        }
                        .-book-pic{
                            position: relative;
                            cursor:pointer;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                            width: 186px;
                            border:3px solid #ffffff;
                            box-shadow: 0 0 2px #999999;
                            transition:all 0.5s linear 0s;
                            .info{
                                position: absolute;
                                bottom: 40px;
                                left: 0;
                                /*float: left;*/
                                height: 70px;
                                width:20px;
                                background-color: #ffffff;
                                opacity: 0.8;
                                border-radius: 0 2px 2px 0;
                                transition:width 0.5s;
                                -webkit-transition:width 0.5s;
                                &:hover{
                                    width:180px;
                                }
                            }

                            &:hover{
                                border:3px solid #1049A9;
                            }

                        }
                    }
                }
            }
        }
        .ant-input:focus{
            background-color: #FFA400;
        }
        .ant-card-grid{
            padding: 0;
        }
        .anticon {
            line-height: 45px;
        }
        .ant-btn-primary{
            background-color: #FFA400;
            border-color:#FFA400;
        }
    }

</style>
