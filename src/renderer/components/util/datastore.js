const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
import LodashId from 'lodash-id'
const adapter = new FileSync('db.json')
const db = low(adapter)
db._.mixin(LodashId)

export default db