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
            let f_name = hbs_dir_info.files[nf].split(".")[0]
            let site_adress = hbs_dir_info.files[nf].slice(0, hbs_dir_info.files[nf].length - 4)
            location.push({
                site_adress: site_adress,
                name: f_name[0].toUpperCase() + f_name.slice(1),
                file: hbs_dir_info.files[nf],
                location: `${folder}hbs/${hbs_dir_info.files[nf]}`
            })
        }

        let first_options = {
            id: -1,
            name: "default" [0].toUpperCase() + "default".slice(1),
            files: location
        }

        folder_list.hbs.categories.push(first_options)

        location = []

        for (let nf = 0; nf < js_dir_info.files.length; nf++) {
            let f_name = js_dir_info.files[nf].split(".")[0]
            let site_adress = js_dir_info.files[nf].slice(0, js_dir_info.files[nf].length - 3)
            location.push({
                site_adress: site_adress,
                name: f_name[0].toUpperCase() + f_name.slice(1),
                file: js_dir_info.files[nf],
                location: `${folder}js/${js_dir_info.files[nf]}`
            })
        }

        first_options = {
            name: "default" [0].toUpperCase() + "default".slice(1),
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
            hbs_subdir_info.files = temp_all_files.filter(name => {
                let name_end = name.split(".")[1]
                if (name_end != `json`) return true
            })
            folder_list.hbs.all_files = all_files_type.concat(hbs_subdir_info.files)

            location = []

            for (let nf = 0; nf < hbs_subdir_info.files.length; nf++) {
                let f_name = hbs_subdir_info.files[nf].split(".")[0].slice(current_folder.length + 1)
                let site_adress = hbs_subdir_info.files[nf].slice(0, hbs_subdir_info.files[nf].length - 4)
                location.push({
                    site_adress: site_adress,
                    name: f_name[0].toUpperCase() + f_name.slice(1),
                    file: `${hbs_subdir_info.files[nf]}`,
                    location: `${folder}hbs/${hbs_subdir_info.files[nf]}`
                })
            }
            let folder_id = require(`${folder}hbs/${current_folder.toLowerCase()}/info.json`).id
            let options = {
                id: folder_id,
                name: current_folder[0].toUpperCase() + current_folder.slice(1),
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
                let f_name = js_subdir_info.files[nf].split(".")[0].slice(current_folder.length + 1)
                let site_adress = js_subdir_info.files[nf].slice(0, js_subdir_info.files[nf].length - 3)
                location.push({
                    site_adress: site_adress,
                    name: f_name[0].toUpperCase() + f_name.slice(1),
                    file: `${js_subdir_info.files[nf]}`,
                    location: `${folder}js/${js_subdir_info.files[nf]}`
                })
            }
            let options = {
                name: current_folder[0].toUpperCase() + current_folder.slice(1),
                files: location
            }

            folder_list.js.categories.push(options)
        }

        return folder_list
    }
}