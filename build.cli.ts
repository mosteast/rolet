const fs = require('fs')
const shell = require('shelljs')

const tmp_path = './tmp'
const git_path = 'build/.git'
const git_backup_path = `${tmp_path}/.git_tmp_backup`
shell.mkdir('-p', tmp_path)
shell.mv(git_path, git_backup_path)
shell.exec(`npm version patch`)
shell.exec(`rm -fr build/* && npx tsc`)
shell.mv(git_backup_path, git_path)
shell.cp('readme.md', 'build/readme.md')

const json = require('./package.json')
delete json.files
json.main = 'index.js'
json.type = 'index.d.ts'

fs.writeFile('./build/package.json', JSON.stringify(json), () => {})
