// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Tài liệu Subiz',
	tagline: 'Chúng tôi sẵn sàng trợ giúp bạn',
	url: 'https://subiz.com.vn',
	baseUrl: '/docs',
	onBrokenLinks: 'throw',
	markdown: {
		hooks: {
			onBrokenMarkdownLinks: 'warn',
		},
	},
	favicon: '/img/favicon.ico',
	organizationName: 'subiz',
	projectName: 'subizhome',
	plugins: [
		'plugin-image-zoom',
		// require.resolve('docusaurus-lunpluginrp-search')
		[
			'@docusaurus/plugin-client-redirects',
			{
				redirects: [
					{
						to: '/735781858-faqs-cau-hoi-thuong-gap-ve-zns',
						from: ['/docs/735781858-faqs---cau-hoi-thuong-gap-ve-zns'],
					},
					{
						to: '/735781858-faqs-cau-hoi-thuong-gap-ve-zns',
						from: ['/735781858-faqs---cau-hoi-thuong-gap-ve-zns'],
					},
				],
			},
		],
	],
	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			{
				sitemap: {
					lastmod: 'date',
					changefreq: 'weekly',
					priority: 0.5,
					ignorePatterns: ['/tags/**'],
					filename: 'sitemap.xml',
				},
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
			},
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
	clientModules: ['./static/js/custom.js'],
	themeConfig: {
		docs: {
			sidebar: {
				hideable: false,
				autoCollapseCategories: false,
			},
		},
		algolia: {
			// The application ID provided by Algolia
			appId: 'KMSSP41O2O', // hamy@subiz.com

			// Public API key: it is safe to commit it
			apiKey: '1dfabfe59e75bf2e37d5b037ac6dee95',

			indexName: 'subiz-com',
		},
		imageZoom: {
			// CSS selector to apply the plugin to, defaults to '.markdown img'
			selector: '.markdown img',
			// Optional medium-zoom options
			// see: https://www.npmjs.com/package/medium-zoom#options
			options: {
				background: 'rgba(0, 0, 0, 0.75)',
			},
		},
		colorMode: {
			disableSwitch: true,
		},
		navbar: {
			title: 'Subiz hỗ trợ',
			logo: {
				alt: 'Subiz Logo',
				href: 'https://subiz.com.vn',
				src: '/img/logo.svg',
				width: 30,
				height: 32,
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
		// prism: {
		// theme: darkCodeTheme,
		// darkTheme: darkCodeTheme,
		//},
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
					href: 'https://subiz.com.vn/terms-of-service',
				},
			],
		},
	},
}

module.exports = config
