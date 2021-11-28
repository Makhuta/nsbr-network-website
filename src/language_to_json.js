const fs = require("fs")

async function read_directory({ folder, folder_extension }) {
    let files
    let folders
    await new Promise((resolve, reject) => {
        fs.readdir(folder + folder_extension, async(err, f) => {
            files = f.filter(fle => fle.split(".").length > 1)
            folders = f.filter(fle => fle.split(".").length < 2)
            resolve(files, folders)
        })
    })
    return { files: files, folders: folders }
}

module.exports = {
    async run(root_name) {
        const lang_dir = root_name + "/lang/"
        let lang_list = {
            all_langs: [],
            langs: []
        }

        let lang_dir_info = await read_directory({ folder: lang_dir, folder_extension: "" })


        for (let f = 0; f < lang_dir_info.folders.length; f++) {
            let lang_name = lang_dir_info.folders[f]
            let lang_files = (await read_directory({ folder: lang_dir, folder_extension: lang_name + "/" })).files
            let options = {
                lang_name: lang_name,
                lang_files: lang_files
            }
            lang_list.all_langs.push(lang_name)
            lang_list.langs.push(options)
        }

        return (lang_list)

    }
}