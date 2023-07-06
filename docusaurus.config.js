// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('prism-react-renderer/themes/palenight')

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Tài liệu Subiz',
	tagline: ' Chúng tôi sẵn sàng trợ giúp bạn',
	url: 'https://subiz.com.vn',
	baseUrl: '/docs/',
	onBrokenLinks: 'throw',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/favicon.ico',
	organizationName: 'subiz',
	projectName: 'subizhome',
	plugins: [
		'plugin-image-zoom',
		// require.resolve('docusaurus-lunpluginrp-search')
	],
	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					showLastUpdateTime: true,
					breadcrumbs: false,
					sidebarCollapsible: false,
					sidebarPath: require.resolve('./sidebars.js'),
					routeBasePath: '/',
				},
				blog: false,
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],

	i18n: {
		defaultLocale: 'vi',
		locales: ['en', 'vi'],
		localeConfigs: {
			en: {
				htmlLang: 'en-US',
			},
			// You can omit a locale (e.g. fr) if you don't need to override the defaults
			vi: {
				htmlLang: 'vi-VN',
			},
		},
	},

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
				algolia: {
						// The application ID provided by Algolia
						appId: '0RST30TI5Y',

						// Public API key: it is safe to commit it
						apiKey: '5ba0cd57d84ae9c8758dc89e7528c29d',

						indexName: 'subiz_doc',
				},
			imageZoom: {
				// CSS selector to apply the plugin to, defaults to '.markdown img'
				selector: '.markdown img',
				// Optional medium-zoom options
				// see: https://www.npmjs.com/package/medium-zoom#options
				options: {
					margin: 24,
					background: '#BADA55',
					scrollOffset: 0,
					container: '#zoom-container',
					template: '#zoom-template',
				},
			},
			colorMode: {
				disableSwitch: true,
			},
			navbar: {
				title: 'Subiz hỗ trợ',
				logo: {
					alt: 'Subiz Logo',
					src: 'img/logo.svg',
				},
				items: [
					{
						type: 'localeDropdown',
						position: 'left',
					},
					{
						href: 'https://app.subiz.com.vn',
						label: 'Gặp tư vấn viên',
						position: 'right',
					},

					{
						href: 'https://app.subiz.com.vn',
						label: 'Trang quản trị',
						position: 'right',
					},
				],
			},
			prism: {
				theme: darkCodeTheme,
				darkTheme: darkCodeTheme,
			},
			footer: {
				links: [
					{
						label: 'Về chúng tôi',
						href: 'https://subiz.com.vn/vi/whyus.html',
					},
					{
						label: 'Fanpage',
						href: 'https://www.facebook.com/subizdotcom/',
					},
					{
						label: 'Zalo',
						href: 'https://zalo.me/935022139843821727',
					},
					{
						label: 'Điều khoản và chính sách',
						href: 'https://subiz.com.vn/vi/terms-of-service.html',
					},
				],
			},
		}),
}

module.exports = config
