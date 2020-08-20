import db from "./datastore";

//更新或添加数据
export function setMeta(meta, url, path) {
    if (!db.has('posts').value()) {
        db.defaults({books: []})
            .write()
    }
    if (!db.get('books')
        .find({id: meta.identifier})
        .value()) {
        db.get('books')
            .push({id: meta.identifier, title: meta.title, creator: meta.creator, url: url, path: path, schedule: 0})
            .write()
    }

}

//删除书籍数据
export function deleteMeta(id) {
    db.get('books').remove({id: id}).write()
}

//是否存在书籍数据
export function isMeta(id) {
    return !!db.get('books')
        .find({id: id})
        .value();
}

//获取所有数据数据
export function getAllMeta() {
    return db.read().get('books').value()
}

//创建书籍数据
export function createBooks() {
    db.defaults({ books: [] })
        .write()
}

//获取书籍信息
export function getMeta(id) {
    return db.get('books')
        .find({id: id})
        .value()
}
//设置进度
export function setSchedule(id,schedule) {
    db.get('books')
        .find({id: id})
        .assign({schedule: schedule})
        .write()
}

//更新或添加设置
export function setSetting(info) {
    if (!db.has('setting').value()) {
        db.defaults({setting: {bgColor: 1, fontSize: 16, fontFamily: 1}})
            .write()
    }
    //更新背景色
    if (info.bgColor) {
        db.set('setting.bgColor', info.bgColor)
            .write()
    }
    //更新字体大小
    if (info.fontSize) {
        db.set('setting.fontSize', info.fontSize)
            .write()
    }
    //更新字体
    if (info.fontFamily) {
        db.set('setting.fontFamily', info.fontFamily)
            .write()
    }
}

//获取设置项
export function getSetting() {
    return db.read().get('setting').value()
}

