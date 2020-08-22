var fs = require('fs');

//拷贝文件
export function copyFile(sourcePath,destPath,callback) {
    fs.exists("./books",exists => {
        if(exists){
            fs.copyFile(sourcePath,destPath,callback)
        }else{
            fs.mkdir('./books',function(error){
                if(error){
                    console.log(error);
                    return false;
                }
                console.log('创建目录成功');
                fs.copyFile(sourcePath,destPath,callback)
            })
        }
    })

}
//拷贝文件
export function deleteFile(sourcePath) {
    fs.unlinkSync(sourcePath)
}