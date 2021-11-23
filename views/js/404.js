module.exports = {
    run(config) {
        let options = {
            token: "404",
            title: "Error 404"
        }
        config.res.render(config.site, options)
    }
}