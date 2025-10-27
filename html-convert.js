const fs = require('fs')
const cheerio = require('cheerio')
const lo = require('lodash')
const html2md = require('./convert.js')
const {uploadYoutubeToCloudflare} = require('./google-drive-image.js')

/**
 * Lấy danh sách link youtube đứng một mình trong HTML
 */
function extractStandaloneYouTubeLinks(html) {
	const $ = cheerio.load(html)
	const links = []

	$('a[href]').each((_, el) => {
		const $a = $(el)
		const href = $a.attr('href') || ''
		const text = ($a.text() || '').trim()

		// Kiểm tra xem đây có phải là link youtube không
		let realHref = extractRealYouTubeUrl(href)
		if (!realHref) return

		// Kiểm tra "đứng 1 mình" trong p hoặc div
		const parent = $a.parent()
		const parentHtml = parent.html().trim()

		// Nếu trong parent chỉ có 1 thẻ a (và không có text khác)
		if (parent.children().length === 1 && parent.children()[0] === el && !parentHtml.replace($.html(el), '').trim()) {
			links.push(realHref)
		}
	})

	return lo.uniq(links)
}

function getYoutubeId(url) {
	try {
		const parsed = new URL(url)
		if (parsed.hostname !== 'www.youtube.com' && parsed.hostname !== 'youtube.com') {
			return null
		}

		// Lấy giá trị query param "v"
		return parsed.searchParams.get('v')
	} catch {
		return null
	}
}

function extractRealYouTubeUrl(href) {
	if (!href) return null
	console.log('extractRealYouTubeUrl', href)
	if (!lo.startsWith(href, 'http')) return

	// Nếu là link google redirect
	if (href.startsWith('https://www.google.com/url')) {
		try {
			const url = new URL(href)
			const q = url.searchParams.get('q')
			q = decodeURIComponent(q)
			let newUrl = new URL(q)
			if (q.hostname !== 'www.youtube.com' && q.hostname !== 'youtube.com') return
			return q
		} catch (e) {
			return null
		}
	}

	return href
}

/**
 * Thay thế các link youtube đứng 1 mình bằng <video src="youtube-id"></video>
 */
function replaceStandaloneYouTubeLinks(html, videoMapping) {
	const $ = cheerio.load(html)

	$('a[href]').each((_, el) => {
		const $a = $(el)
		const href = $a.attr('href') || ''
		let realHref = extractRealYouTubeUrl(href)
		if (!realHref) return

		const parent = $a.parent()
		const parentHtml = parent.html().trim()

		// Link đứng 1 mình
		if (parent.children().length === 1 && parent.children()[0] === el && !parentHtml.replace($.html(el), '').trim()) {
			const youtubeId = getYoutubeId(realHref)
			if (!youtubeId) return
			let uploadedLink = videoMapping[realHref]
			if (!uploadedLink) return
			$a.replaceWith(`<embedvideo src="${uploadedLink}"></embedvideo>`)
		}
	})

	return $.html()
}

async function standardlizeHtmlLinkToVideo(html) {
	let links = extractStandaloneYouTubeLinks(html)
	console.log('extract standalone links', links)
	if (!lo.size(links)) return html

	let cache = {}
	try {
		cache = fs.readFileSync('./data/header.json', 'utf8')
		cache = JSON.parse(cache)
	} catch (err) {
		cache = {}
	}
	console.log('cache', cache)

	let videoMapping = cache.video_mapping || {}
	for (let i = 0; i < lo.size(links); i++) {
		let link = links[i]
		if (videoMapping[link]) continue

		let res = await uploadYoutubeToCloudflare(link)
		if (res.preview) videoMapping[link] = res.preview
	}
	cache.video_mapping = videoMapping
	fs.writeFileSync('./data/header.json', JSON.stringify(cache, null, '\t'))
	let result = replaceStandaloneYouTubeLinks(html, videoMapping)
	console.log('000000000', result)
}

module.exports = {
	replaceStandaloneYouTubeLinks,
	extractStandaloneYouTubeLinks,
	standardlizeHtmlLinkToVideo,
}

async function main() {
	const html = fs.readFileSync('./testcases/input1.html', 'utf8')
	let res = await standardlizeHtmlLinkToVideo(html)
	//let result = extractStandaloneYouTubeLinks(html)
	//let result2 = replaceStandaloneYouTubeLinks(html)
	//console.log('result2', result2)
	//let md = await html2md(result2)
	//console.log('\n\n\nMD', md)
}

main()
