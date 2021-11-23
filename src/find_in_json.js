module.exports = {
    async run({ json, search_value }) {
        let result
        let files_json = []
        for (let c = 0; c < json.length; c++) {
            let category = json[c]
            for (let f = 0; f < category.files.length; f++) {
                files_json.push(category.files[f])
            }
        }
        result = files_json.filter(file => file.file == search_value)[0].location
        return result
    }
}