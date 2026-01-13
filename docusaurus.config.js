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
						to: '/115690085-khac-phuc-su-co',
						from: [
							'/344116404-xu-ly-loi-tong-dai',
							'/1045817660-xu-ly-loi-tren-fanpage',
							'/1779729704-xu-ly-loi-zalo-oa',
						],
					},
					{
						to: '/1387158228-quan-ly-hoi-thoai',
						from: ['/1387158228-quan-ly-hoi-thoai-tin-nhan'],
					},
					{
						to: '/456469809-tich-hop-dau-so',
						from: ['/66096501-chien-dich-telesales'],
					},
					{
						to: '/2039731542-nhac-viec',
						from: ['/2039731542-nhac-viec-can-lam'],
					},
					{
						to: '/1957649110-sdk-tuy-chinh-cua-so-chat',
						from: ['/1957649110-api-ket-noi-subiz'],
					},
					{
						to: '/352944605-bang-tinh-nang',
						from: ['/352944605-bang-tinh-nang-subiz'],
					},
					{
						to: '/352944605-bang-tinh-nang',
						from: ['/docs/352944605-bang-tinh-nang-subiz'],
					},
					{
						to: '/1543153800-mau-tin-nhan-zns',
						from: ['/1543153800-cach-tao-mau-tin-nhan-zns'],
					},
					{
						to: '/300561377-gui-tin-nhan-zns',
						from: ['/300561377-gui-tin-nhan-zns-tren-subiz'],
					},
					{
						to: '/1168493719-email-marketing',
						from: ['/1168493719-gui-hang-loat-email-marketing'],
					},
					{
						to: '/583253150-cua-so-chat',
						from: ['/583253150-chinh-sua-cua-so-chat-dep'],
					},
					{
						to: '/1139647591-fanpage',
						from: ['/1139647591-ket-noi-fanpage'],
					},
					{
						to: '/1139647591-fanpage',
						from: ['/1068952124-cac-tinh-nang-subiz-ho-tro-fanpage'],
					},
					{
						to: '/1579085486-zalo-ca-nhan',
						from: ['/1579085486-tich-hop-zalo-ca-nhan-vao-subiz'],
					},
					{
						to: '/297964546-zalo-oa',
						from: ['/297964546-ket-noi-zalo-oa'],
					},
					{
						to: '/1245788391-email',
						from: ['/1245788391-ket-noi-email'],
					},
					{
						to: '/984010358-google-business',
						from: ['/984010358-kenh-google'],
					},
					{
						to: '/732776091-instagram',
						from: ['/732776091-ket-noi-instagram'],
					},
					{
						to: '/628554948-agent',
						from: ['/628554948-agent-la-gi'],
					},
					{
						to: '/972963943-rule-phan-phoi',
						from: ['/972963943-rule-phan-phoi-hoi-thoai'],
					},
					{
						to: '/33314021-ban-giao-truoc-khi-agent-nghi',
						from: ['/33314021-xu-ly-khi-co-nhan-vien-nghi-viec-tren-subiz'],
					},
					{
						to: '/1540866648-auto-chatbot',
						from: ['/1540866648-bot-tu-dong-nhan-tin'],
					},
					{
						to: '/102007810-kich-ban-chatbot-mau',
						from: ['/102007810-mot-so-mau-kich-ban-bot'],
					},
					{
						to: '/698043010-chatbot-ai',
						from: ['/698043010-su-dung-subiz-chatbot-ai'],
					},
					{
						to: '/1083215603-popup',
						from: ['/1083215603-popup-chuyen-doi-khach-tiem-nang'],
					},
					{
						to: '/1968656234-subiz-live',
						from: ['/1968656234-subiz-live-khach-truy-cap-web'],
					},
					{
						to: '/1812321398-tich-hop-zalo-cloud-connect',
						from: ['/1812321398-ket-noi-cuoc-goi-zalo-oa'],
					},
					{
						to: '/1221805713-khach-hang-tiem-nang',
						from: ['/1221805713-quan-ly-khach-tiem-nang'],
					},
					{
						to: '/1802811302-nhan-phan-loai',
						from: ['/1802811302-nhan-phan-loai-khach-hang'],
					},
					{
						to: '/456469809-tich-hop-dau-so',
						from: ['/456469809-ket-noi-so-tong-dai'],
					},
					{
						to: '/735781858-faqs-ve-zns',
						from: ['/735781858-faqs---cau-hoi-thuong-gap-ve-zns'],
					},
					{
						to: '/735781858-faqs-ve-zns',
						from: ['/735781858-faqs-cau-hoi-thuong-gap-ve-zns'],
					},
					{
						to: '/1139647591-fanpage',
						from: ['/1068952124-tu-dong-phan-hoi-fanpage'],
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
