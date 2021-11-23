module.exports = {
    run(config) {
        let options = {
            token: "contact",
            title: "NSBR Network"
        }
        config.res.render(config.site, options)
    }
}