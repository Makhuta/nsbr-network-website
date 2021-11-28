const express = require("express")
const hbs = require("express-handlebars")
const fs = require("fs")
const util = require("util")
const app = express()
const fetch = require('node-fetch');

const delay_time = 600000

var port = process.env.PORT || 8080
var host = process.env.HOST




var item_list = require("./src/files_to_json").run(__dirname)



var layoutslozka = __dirname + "/layouts"

setInterval(async function() {
    if (!host) return
    fetch(host)
}, delay_time)


app.engine("hbs", hbs.create({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: layoutslozka
}).engine)

app.set("view engine", "hbs")

app.use(express.static("public"))
app.use("/css", express.static(__dirname + "/public/css"))
app.use("/js", express.static(__dirname + "/public/js"))
app.use("/img", express.static(__dirname + "/public/img"))


app.get("/*", async function(req, res) {
    item_list = await item_list
    let item_list_all = util.inspect(item_list, false, null, true)
    let hbs_item_list = (await item_list).hbs
    let js_item_list = (await item_list).js
    let site_path = req._parsedOriginalUrl.pathname.slice(1).split(".")[0]
    if (site_path.length == 0) site_path = "index"
    let title = site_path.toLowerCase()
    let token = req.query.token
    let default_site = `${req.protocol}://${req.headers.host}/`

    let site = `${title}.hbs`

    let config = {
        item_list: await item_list,
        site: "",
        res: res,
        req: req,
        default_site: default_site,
        token: token
    }



    //console.log(config)
    if (!hbs_item_list.all_files.includes(site)) {
        config.site = await require("./src/find_in_json").run({ json: (await item_list).hbs.categories, search_value: "404.hbs" })
        require("./views/js/404").run(config)
        return
    }

    config.site = await require("./src/find_in_json").run({ json: (await item_list).hbs.categories, search_value: site })

    let output_file = await require("./src/find_in_json").run({ json: (await item_list).js.categories, search_value: `${title}.js` })

    require(output_file).run(config)
})











app.listen(port, () => console.info(`App listening on port: ${port}`))