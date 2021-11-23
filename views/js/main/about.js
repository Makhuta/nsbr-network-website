module.exports = {
    run(config) {
        let options = {
            token: "about",
            title: "NSBR Network"
        }
        config.res.render(config.site, options)
    }
}