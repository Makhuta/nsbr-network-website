const express = require("express")
const hbs = require("express-handlebars")
const fs = require("fs")
const app = express()
const sites_paths = []

require("./src/files_to_json").run(__dirname)

var port = process.env.PORT || 8080

var layoutslozka = __dirname + "/layouts"

app.engine("hbs", hbs.create({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: layoutslozka
}).engine)

app.set("view engine", "hbs")

app.use(express.static("public"))
app.use("/css", express.static(__dirname + "public/css"))
app.use("/js", express.static(__dirname + "public/js"))
app.use("/img", express.static(__dirname + "public/img"))

app.get("/*", async function(req, res) {
    let site_path = req._parsedOriginalUrl.pathname.slice(1).split(".")[0]
    if (site_path.length == 0) site_path = "index"
    let token = req.query.token

    console.log(site_path)
    let filtered_category = sites_paths.filter(one_path => one_path.files)

    let files = []
    await new Promise((resolve, reject) => {
        fs.readdir(__dirname + "/views", (err, f) => {
            for (let i = 0; i < f.length; i++) {
                let file = f[i]
                files.push(file)
                files.push(file.split(".")[0])
            }
            resolve(files)
        })
    })

    if (site_path.includes("css") || site_path.includes("js")) {
        console.log("includes")
        res.end()
        return
    }

    if (files.includes(site_path)) {
        let options = {
            sighnpost: sites_paths
        }
        res.render(site_path, options)
    } else res.render("404")
})

app.listen(port, () => console.info(`App listening on port: ${port}`))




















/*
app.get("/", async function(req, res) {
    var _token = req.query.site || default_token
    let host_value = (process.env.SECURITY || "http://") + req.headers.host + "/?site="
    var js_list = []
    var hbs_list = []
    var js_exist = []
    var hbs_exist = []



    var ip = 0

    if (!module.exports.web.visitors.includes(ip)) {
        module.exports.web.visitors.push(ip)
    }

    let styles_names = fs.readdirSync(public_path + "/styles")
    let scripts_names = fs.readdirSync(public_path + "/scripts")

    let styles = []
    let scripts = []

    styles_names.forEach(style => {
        styles.push({ name: style })
    })

    scripts_names.forEach(script => {
        scripts.push({ name: script })
    })

    var public_list = ({ styles: styles, scripts: scripts })

    let hbs_folders = fs.readdirSync(hbs_webout)
    let hbs_files

    let js_folders = fs.readdirSync(js_webout)
    let sp_pos = js_folders.indexOf(js_folders.find(s => s == "signpost.js"))
    js_folders.splice(sp_pos, sp_pos + 1)
    let js_files

    hbs_folders.forEach(f => {
        hbs_files = fs.readdirSync(hbs_webout + f)
        let soubory_bez_koncovky = []
        hbs_files.forEach(s => {
            soubory_bez_koncovky.push(s.split(".")[0])
        })
        hbs_list.push(soubory_bez_koncovky)
    })

    js_folders.forEach(f => {
        js_files = fs.readdirSync(js_webout + f)
        let soubory_bez_koncovky = []
        js_files.forEach(s => {
            soubory_bez_koncovky.push(s.split(".")[0])
        })
        js_list.push(soubory_bez_koncovky)
    })

    hbs_list.forEach(file => {
        hbs_exist.push(file.includes(_token))
    })

    js_list.forEach(file => {
        js_exist.push(file.includes(_token))
    })

    if (!(hbs_exist.includes(true))) {
        let slozka = js_folders.indexOf('main')
        let hodnoty = ({ res: res, view_hbs: hbs_webout + js_folders[slozka] + "/" + "error", title: "HBS ERROR", host_value: host_value, token: "error", app: app, folder: js_folders[slozka], layoutsDir: layoutslozka, public_list: public_list })
        await require("./ws_handlers/getting_variables/signpost").run(hodnoty)
    } else if (!(js_exist.includes(true))) {
        let slozka = js_folders.indexOf('main')
        let hodnoty = ({ res: res, view_hbs: hbs_webout + js_folders[slozka] + "/" + "error", title: "JS ERROR", host_value: host_value, token: "error", app: app, folder: js_folders[slozka], layoutsDir: layoutslozka, public_list: public_list })
        await require("./ws_handlers/getting_variables/signpost").run(hodnoty)
    } else {
        let slozka = js_exist.indexOf(true)
        let name = _token
        let out_name = name.split("_").join(" ")
        let title = out_name[0].toUpperCase() + out_name.slice(1)
        let hodnoty = ({ res: res, view_hbs: hbs_webout + js_folders[slozka] + "/" + _token, title: title, host_value: host_value, token: _token, app: app, folder: js_folders[slozka], layoutsDir: layoutslozka, public_list: public_list })
        await require("./ws_handlers/getting_variables/signpost").run(hodnoty)
    }
})

app.listen(port, function() {
    console.log(`Website running on port ${port}`)
})

app.post("/sendMessage", async(req, res) => {
    var _token = req.body.token

    let hodnoty = ({ req: req, res: res })
    await require("./ws_handlers/zpravy_format/" + _token + ".js").run(hodnoty)
})

module.exports.web = {
    ip: process.env.PING_WEBSITE || "No website IP.",
    visitors: [],
    start: Date.now()
}*/