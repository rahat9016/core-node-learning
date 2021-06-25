const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '/../.data/')

lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err1, fileDescriptor) => {

        if (!err1 && fileDescriptor) {
            const stringData = JSON.stringify(data)
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false)
                        } else {
                            callback('Error Closing New file')
                        }
                    })
                } else {
                    callback('Error writing to new file')
                }
            })

        } else {
            callback('could not create new file, it may already exists')
        }
    })
}
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data)
    })
}
lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data)
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callback(false)
                                } else {
                                    callback('Error closing file ')
                                }
                            })
                        } else {
                            callback(`Error writing to file`)
                        }
                    })
                } else {
                    callback(`Error Truncating file `)
                }
            })
        } else {
            callback('Error updating file may not exist')
        }
    })
}
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false)
        } else {
            callback('Error deleting file')
        }
    })
}
module.exports = lib