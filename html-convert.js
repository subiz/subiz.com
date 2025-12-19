const fs = require('fs')
const cheerio = require('cheerio')
const lo = require('lodash')
const html2md = require('./convert.js')
const {uploadYoutubeToCloudflare} = require('./google-drive-image.js')

function videoTextContentToUrl(text) {
	try {
		const url = new URL(text)
		if (url.hostname === 'www.google.com' && url.pathname === '/url') {
			const params = new URLSearchParams(url.search)
			const qParam = params.get('q')
			if (qParam) {
				return decodeURIComponent(qParam)
			}
		}
		return text // Return original text if not a Google redirect or 'q' param is missing
	} catch (error) {
		// If text is not a valid URL, return it as is.
		return ''
	}
}

async function standardlizeHtmlLinkToVideo(html, videoMapping = {}) {
	const $ = cheerio.load(html)
	let extractVideoLinks = []
	$('table').each((_, table) => {
		const tds = $(table).find('td')
		if (tds.length > 1) return

		let text = lo.trim($(tds[0]).text()) || ''
		if (!lo.startsWith(text.toLowerCase(), 'video ') && !lo.startsWith(text.toLowerCase(), 'video=')) return
		if (lo.startsWith(text, 'video ')) text = text.replace('video ', '')
		if (lo.startsWith(text, 'video=')) text = text.replace('video=', '')
		if (lo.startsWith(text, 'Video ')) text = text.replace('Video ', '')
		if (lo.startsWith(text, 'Video=')) text = text.replace('Video=', '')

		const anchorTag = $(tds[0]).find('a')
		let videoLink = ''
		if (anchorTag.length > 0) {
			videoLink = anchorTag.attr('href')
		} else {
			// After stripping prefixes, check if the remaining text is a video link
			if (text) {
				// If text is not empty after stripping, consider it a potential video link
				videoLink = text
			}
		}

		videoLink = videoTextContentToUrl(videoLink)

		if (!videoLink) return
		console.log('extractVideoLinks table 1 td ->', videoLink)
		extractVideoLinks.push({
			dom: table,
			url: videoLink,
		})
	})
	if (!lo.size(extractVideoLinks)) return html

	for (let i = 0; i < lo.size(extractVideoLinks); i++) {
		let link = extractVideoLinks[i].url
		if (videoMapping[link]) {
			console.log('CACHE HITTTTTTTTT', link + ': ' + JSON.stringify(videoMapping[link]))
			continue
		}

		console.log('KKKKKK', link)
		let res = await uploadYoutubeToCloudflare(link)
		if (res.preview) {
			videoMapping[link] = {preview: res.preview}
			if (res.input) {
				lo.set(videoMapping, [link, 'resolution'], res.input)
			}
		}
	}

	lo.each(extractVideoLinks, (link) => {
		let previewUrl = lo.get(videoMapping, [link.url, 'preview'])
		if (!previewUrl) {
			console.log('no cloudflare video url found', link.url)
			previewUrl = link.url
		}

		let videoTag = `<embedvideo src="${previewUrl}" data-source-url="${link.url}"></embedvideo>`
		$(link.dom).replaceWith(videoTag)
	})

	return $.html()
}

module.exports = {
	standardlizeHtmlLinkToVideo,
}

//async function main() {
//const html = fs.readFileSync('./testcases/input1.html', 'utf8')
//let res = await standardlizeHtmlLinkToVideo(html)
//}

//main()
