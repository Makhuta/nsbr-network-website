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
    async run(root_dir) {
        let folder = root_dir + "/views/"

        let hbs_dir_info = await read_directory({ folder: folder, folder_extension: `hbs/` })
        let js_dir_info = await read_directory({ folder: folder, folder_extension: `js/` })

        let folder_list = {
            hbs: {
                all_files: hbs_dir_info.files,
                categories: []
            },
            js: {
                all_files: js_dir_info.files,
                categories: []
            }
        }

        let location = []

        for (let nf = 0; nf < hbs_dir_info.files.length; nf++) {
            location.push({
                file: hbs_dir_info.files[nf],
                location: `${folder}hbs/${hbs_dir_info.files[nf]}`
            })
        }

        let first_options = {
            name: "default",
            files: location
        }

        folder_list.hbs.categories.push(first_options)

        location = []

        for (let nf = 0; nf < js_dir_info.files.length; nf++) {
            location.push({
                file: js_dir_info.files[nf],
                location: `${folder}js/${js_dir_info.files[nf]}`
            })
        }

        first_options = {
            name: "default",
            files: location
        }

        folder_list.js.categories.push(first_options)

        for (let f = 0; f < hbs_dir_info.folders.length; f++) {
            let current_folder = hbs_dir_info.folders[f]
            let all_files_type = folder_list.hbs.all_files
            let temp_all_files = []
            let hbs_subdir_info = await read_directory({ folder: folder, folder_extension: `hbs/${current_folder}` })
            for (let ft = 0; ft < hbs_subdir_info.files.length; ft++) {
                temp_all_files.push(`${current_folder.toLowerCase()}/${hbs_subdir_info.files[ft].toLowerCase()}`)
            }
            hbs_subdir_info.files = temp_all_files
            folder_list.hbs.all_files = all_files_type.concat(hbs_subdir_info.files)

            location = []

            for (let nf = 0; nf < hbs_subdir_info.files.length; nf++) {
                location.push({
                    file: `${hbs_subdir_info.files[nf]}`,
                    location: `${folder}hbs/${hbs_subdir_info.files[nf]}`
                })
            }
            let options = {
                name: current_folder,
                files: location
            }

            folder_list.hbs.categories.push(options)
        }

        for (let f = 0; f < js_dir_info.folders.length; f++) {
            let current_folder = js_dir_info.folders[f]
            let all_files_type = folder_list.js.all_files
            let temp_all_files = []
            let js_subdir_info = await read_directory({ folder: folder, folder_extension: `js/${current_folder}` })
            for (let ft = 0; ft < js_subdir_info.files.length; ft++) {
                temp_all_files.push(`${current_folder.toLowerCase()}/${js_subdir_info.files[ft].toLowerCase()}`)
            }
            js_subdir_info.files = temp_all_files
            folder_list.js.all_files = all_files_type.concat(js_subdir_info.files)

            location = []

            for (let nf = 0; nf < js_subdir_info.files.length; nf++) {
                location.push({
                    file: `${js_subdir_info.files[nf]}`,
                    location: `${folder}js/${js_subdir_info.files[nf]}`
                })
            }
            let options = {
                name: current_folder,
                files: location
            }

            folder_list.js.categories.push(options)
        }

        return folder_list
    }
}