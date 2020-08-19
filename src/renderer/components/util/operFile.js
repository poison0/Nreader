var fs = require('fs');

//拷贝文件
export function copyFile(sourcePath,destPath,callback) {
    fs.copyFile(sourcePath,destPath,callback)
}
//拷贝文件
export function deleteFile(sourcePath) {
    fs.unlinkSync(sourcePath)
}