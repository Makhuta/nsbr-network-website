module.exports = {
    run(config) {
        let options = {
            token: "404",
            title: "Error 404",
            default_site: config.default_site
        }
        config.res.render(config.site, options)
    }
}