import db from "./datastore";

export function setMeta(meta,url,path) {
    if(!db.has('posts').value()){
        db.defaults({ books: [] })
            .write()
    }
    if(!db.get('books')
        .find({ id: meta.identifier })
        .value()){
        db.get('books')
            .push({ id: meta.identifier,title:meta.title,creator:meta.creator,url:url,path:path})
            .write()
    }

}
export function deleteMeta(id) {
    db.get('books').remove({ id: id }).write()
}
export function isMeta(id) {
    if(db.get('books')
        .find({ id: id })
        .value()){
        return true;
    }else{
        return false
    }
}
export function getAllMeta() {
    return  db.read().get('books').value()
}
export function createBooks() {
    db.defaults({ books: [] })
        .write()
}