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
<!--                    <div class="bookItem" :class="{bookItemChecked:navigation === 1}" @click="chooseLabel(1)">-->
<!--                        <div class="bookLabel">-->
<!--                            <a-icon type="minus-circle"/>-->
<!--                            <div class="labelWord">未分类</div>-->
<!--                        </div>-->
<!--                        <div class="strip" :class="{stripChecked:navigation === 1}"></div>-->
<!--                    </div>-->
<!--                    <div class="bookItem" :class="{bookItemChecked:navigation === 2}" @click="chooseLabel(2)">-->
<!--                        <div class="bookLabel">-->
<!--                            <a-icon type="plus-square"/>-->
<!--                            <div class="labelWord">管理分类</div>-->
<!--                        </div>-->
<!--                        <div class="strip" :class="{stripChecked:navigation === 2}"></div>-->
<!--                    </div>-->
                </div>
            </div>
            <div class="-right-content">
                <div class="-right-bar">
                    <div class="-right-bar-label">全部图书({{bookNum}})</div>
                    <div class="-right-bar-search">
                        <a-input-search placeholder="书名搜索" @search="search" size="small" style="width: 200px"/>
                    </div>
                </div>
                <div class="-right-content-book" :style="'height:'+(pageHeight-90)+'px'">
                    <div class="-book-item" v-for="book in books">
<!--                        <div>-->
<!--                            <svg t="1597847973497" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7462" width="32" height="32"><path d="M512 624a112 112 0 1 0 0-224 112 112 0 0 0 0 224z" p-id="7463" fill="#d81e06"></path></svg>-->
<!--                            新添加-->
<!--                        </div>-->
                        <a-card-grid class="-book-pic" @click="openBook(book)" :title="book.title" @contextmenu="rightClick(book)">
<!--                            <div class="info"></div>-->
                            <img :src="book.url" width="180" />
                        </a-card-grid>
                        <div class="-book-title">{{book.title}}</div>
                    </div>
                    <div v-show="books.length === 0" class="empty-img" :style="'height:'+(pageHeight-90)+'px'">
                        <a-empty description="点击&quot;添加图书&quot;添加书籍"  />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Epub from "epubjs";
    import {isMeta, setMeta, getAllMeta, createBooks,deleteMeta} from "../util/operDb";
    import {copyFile,deleteFile} from "../util/operFile";
    const {dialog,Menu, MenuItem,nativeImage} = require('electron').remote;
    const {ipcRenderer} = require('electron');
    const remote = require('electron').remote;

    global.Epub = Epub
    export default {
        name: 'index-mode',
        data() {
            return {
                //导航
                navigation: 0,
                books:[],
                allBooks:[],
                bookNum:0,
                pageHeight:window.innerHeight,
                searchValue:"",
            }
        },
        mounted() {
            let self = this
            //监视页面大小变化
            remote.getCurrentWindow().on('resize', (a) => {
                self.pageHeight = window.innerHeight;
            })
            ipcRenderer.on("bookClose",()=>{
                this.getAllBookInfo()
            })
           this.getAllBookInfo()
        },
        methods: {
            search(value, event){
                if(value){
                    this.books = [];
                    for (let i = 0; i < this.allBooks.length; i++) {
                        if(this.allBooks[i].title.indexOf(value) > -1){
                            this.books.push(this.allBooks[i])
                        }
                    }
                }else{
                    this.books = this.allBooks
                }
            },
            //右键菜单
            rightClick: function (book) {
                const self = this
                const menu = new Menu()
                menu.append(new MenuItem({
                    label: '打开',
                    icon: nativeImage.createFromPath('src/renderer/assets/open.png'),
                    click: function () {
                        self.openBook(book)
                        // 执行remove方法，不能直接使用 this.removeItem
                        // self.removeItem(id)
                    }
                }))
                menu.append(new MenuItem({
                    type: 'separator',
                }))
                menu.append(new MenuItem({
                    label: '删除',
                    icon: nativeImage.createFromPath('src/renderer/assets/delete.png'),
                    click: function () {
                        self.deleteBook(book)
                    }
                }))
                // 展示出来
                menu.popup(remote.getCurrentWindow())
            },
            //删除图书
            deleteBook(book){
                //删除数据库数据
                deleteMeta(book.id);
                // //删除图书
                deleteFile(book.path);
                //删除显示数据
                for (let i = 0; i < this.books.length; i++) {
                    if(this.books[i].id === book.id){
                        this.books.splice(i,1);
                        break;
                    }
                }
                for (let i = 0; i < this.allBooks.length; i++) {
                    if(this.allBooks[i].id === book.id){
                        this.allBooks.splice(i,1);
                        break;
                    }
                }
                this.bookNum = this.books.length;
                this.$forceUpdate();
            },
            getAllBookInfo(){
                let bookItem = getAllMeta();
                if(bookItem){
                    this.books = bookItem;
                    this.allBooks = bookItem;
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
                        let identifier = result.identifier;
                        if (!identifier) {
                            identifier = this.getID(3)
                        }
                        let path = "./books/"+identifier+".epub";
                        copyFile(bookInfo.filePaths[0],path,(res)=>{
                        })
                        if (!isMeta(identifier)) {
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
            getID(length){
                return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
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
        height: 100%;
        background-color: #EFEFEF;
        position: relative;
        overflow: hidden;
        .header {
            top:0;
            position:absolute;
            display: flex;
            flex-direction: row;
            justify-items: center;
            width: 100%;
            height: 48px;
            background-color: #ffffff;
            /*background-color: #FFA400;*/
            box-shadow: 0 0 4px #999999;
            z-index: 111;

            .title {
                color: #FFA400;
                /*color: #ffffff;*/
                /*color: #FFA400;*/
                font-family: Calibri, "Times New Roman", serif;
                font-size: 20px;
                font-weight: bolder;
                margin-left: 20px;
                width: 100px;
                height: 48px;
                line-height: 48px;
            }
        }

        .content {
            /*position:absolute;*/
            font-family: '华文细黑', 'Courier New', Courier, monospace;
            /*display: flex;*/
            /*flex-direction: row;*/
            /*height: 660px;*/
            height: 100%;
            position: relative;
            margin-top:48px;
            .-left-content {
                float: left;
                /*width: 20%;*/
                width: 200px;
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
                            background-color: #2F89DF;
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
                /*float: right;*/
                /*min-width: 80%;*/
                margin-left: 200px;
                height: 100%;
                display: flex;
                overflow: auto;
                flex-direction: column;
                background-color: #E4E4E4;
                /*position: relative;*/
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
                    /*max-height: 500px;*/
                    overflow-y: scroll;
                    display: flex;
                    flex-direction: row;
                    align-content: flex-start;
                    flex-wrap: wrap;
                    /*margin-left: 10px;*/
                    /*margin-top: 10px;*/
                    /*margin-bottom: 10px;*/
                    background-color: #ffffff;
                    /*box-shadow: 0 0 4px #FFA400;*/
                    .empty-img{
                        /*height: 100%;*/
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding-bottom: 100px;
                    }
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
                                transition:width 0.3s;
                                -webkit-transition:width 0.3s;
                                &:hover{
                                    width:180px;
                                }
                            }

                            &:hover{
                                border:3px solid #2F89DF;
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
