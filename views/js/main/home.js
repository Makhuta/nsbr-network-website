module.exports = {
    run(config) {
        let item_list = config.item_list.hbs.categories.filter(category => category.name != "Default")


        let options = {
            token: "home",
            title: "Main",
            sites: item_list,
            default_site: config.default_site
        }
        config.res.render(config.site, options)
    }
}