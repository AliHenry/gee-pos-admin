module.exports = {
    /*
    ** Headers of the page
    */
    head: {
        title: 'GEE-POS',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: 'Nuxt.js project'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },

    /*
    ** Customize the progress bar color
    */
    loading: {color: '#42A5CC'},

    /**
     * Import CSS
     */
    css: [
        /* Import Font Awesome Icons Set */
        '~/node_modules/flag-icon-css/css/flag-icon.min.css',
        /* Import Font Awesome Icons Set */
        '~/node_modules/font-awesome/css/font-awesome.min.css',
        /* Import Simple Line Icons Set */
        '~/node_modules/simple-line-icons/css/simple-line-icons.css',
        /* Import Bootstrap Vue Styles */
        '~/node_modules/bootstrap-vue/dist/bootstrap-vue.css',
        /* Import Core SCSS */
        {src: '~/assets/scss/style.scss', lang: 'scss'}
    ],

    /*
    ** Import Plugin
     */
    plugins: [
        '~/plugins/vue-notifications',
        '~/plugins/vue-resource',
        '~/plugins/geolocation',
        '~/plugins/moment',
        { src: '~/plugins/vue-airbnb-datepicker.js', ssr: false },
        { src: '~/plugins/currency', ssr: false },
        { src: '~plugins/bootstrap-vue.js', ssr: true},
        { src: "~plugins/persistedstate.js", ssr: false }
    ],

    /*
    ** Build configuration
    */
    build: {
        /*
        ** Run ESLint on save
        */
        extend(config, {isDev, isClient}) {
            if (isDev && isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })

                const vueLoader = config.module.rules.find(
                    ({loader}) => loader === 'vue-loader')
                const {options: {loaders}} = vueLoader || {options: {}}

                if (loaders) {
                    for (const loader of Object.values(loaders)) {
                        changeLoaderOptions(Array.isArray(loader) ? loader : [loader])
                    }
                }

                config.module.rules.forEach(rule => changeLoaderOptions(rule.use))
            }
        },
        vendor: ['vue-notifications']
    },
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/auth',
    ],
    axios: {
        baseURL: 'http://localhost:8000/api',
        // proxyHeaders: false
    },

    auth: {
        plugins: ['~/plugins/auth.js'],
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/auth/login',
                        method: 'post',
                        propertyName: 'response.access_token'
                    },
                    logout: {
                        url: '/auth/logout',
                        method: 'post'
                    },
                    user: {
                        url: '/auth/user',
                        method: 'get',
                        propertyName: 'response.user'
                    }
                },
                // tokenRequired: true,
                // tokenType: 'bearer',
            },
        }
    }
}

function changeLoaderOptions(loaders) {
    if (loaders) {
        for (const loader of loaders) {
            if (loader.loader === 'sass-loader') {
                Object.assign(loader.options, {
                    includePaths: ['./assets']
                })
            }
        }
    }
}


