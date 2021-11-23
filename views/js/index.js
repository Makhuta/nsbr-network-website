module.exports = {
    run(config) {
        let options = {
            token: "index",
            title: "NSBR Network"
        }
        config.res.render(config.site, options)
    }
}