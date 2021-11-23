module.exports = {
    run(config) {
        let options = {
            token: "home",
            title: "NSBR Network"
        }
        config.res.render(config.site, options)
    }
}