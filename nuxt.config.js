require('dotenv').config();

export default {
	// Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
	ssr: false,

	// Target (https://go.nuxtjs.dev/config-target)
	target: 'server',

	// Global page headers (https://go.nuxtjs.dev/config-head)
	head: {
		title: 'VideoLibrarySystem',
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
			{ rel: 'preconnect', href: 'https://fonts.gstatic.com' },
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Condensed:ital@0;1&family=IBM+Plex+Sans:ital,wght@0,400;0,700;1,400;1,700&family=IBM+Plex+Serif:ital@0;1&display=swap'
			},
			{
				rel: 'stylesheet',
				href: 'https://cdn.jsdelivr.net/npm/boxicons@2.0.5/css/boxicons.min.css'
			}
		]
	},

	// Global CSS (https://go.nuxtjs.dev/config-css)
	css: [ 'vuesax/dist/vuesax.css' ],

	// Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
	plugins: [ '@/plugins/vuesax' ],

	// Auto import components (https://go.nuxtjs.dev/config-components)
	components: true,

	// Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		// '@nuxtjs/eslint-module', fuck eslint for now
		'@nuxtjs/dotenv'
	],

	// Modules (https://go.nuxtjs.dev/config-modules)
	modules: [
		// https://go.nuxtjs.dev/axios
		'@nuxtjs/axios',
		// https://go.nuxtjs.dev/pwa
		'@nuxtjs/pwa',
		// for handling auth
		'@nuxtjs/auth',
		// for handling device-specific items
		'@nuxtjs/device'
	],
	auth: {
		strategies: {
			google: {
				client_id: process.env.googlekey
			}
		}
	},

	// Axios module configuration (https://go.nuxtjs.dev/config-axios)
	axios: {},

	// Build Configuration (https://go.nuxtjs.dev/config-build)
	build: {}
};
