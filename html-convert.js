const fs = require('fs')
const cheerio = require('cheerio')
const lo = require('lodash')
const html2md = require('./convert.js')
const {uploadYoutubeToCloudflare} = require('./google-drive-image.js')

function videoTextContentToUrl(text) {
		console.log("DDDDDDDDDDDDDDD", text)
	if (lo.startsWith(text, 'video ')) return text.replace('video ', '')
	if (lo.startsWith(text, 'video=')) return text.replace('video=', '')
	if (lo.startsWith(text, 'Video ')) return text.replace('Video ', '')
	if (lo.startsWith(text, 'Video=')) return text.replace('Video=', '')
}

async function standardlizeHtmlLinkToVideo(html, videoMapping = {}) {
	const $ = cheerio.load(html)
	let extractVideoLinks = []
	$('table').each((_, table) => {
		const tds = $(table).find('td')
		if (tds.length > 1) return

		const text = lo.trim($(tds[0]).text()) || ''
		if (text.startsWith('video') || text.startsWith('Video')) {
			console.log('extractVideoLinks table 1 td', text)
			extractVideoLinks.push({
				dom: table,
				url: videoTextContentToUrl(text),
			}) // hoặc push chính table DOM cheerio nếu bạn muốn
		}
	})
	if (!lo.size(extractVideoLinks)) return html

	for (let i = 0; i < lo.size(extractVideoLinks); i++) {
		let link = extractVideoLinks[i].url
		if (videoMapping[link]) {
			console.log('CACHE HITTTTTTTTT', link + ': ' + JSON.stringify(videoMapping[link]))
			continue
		}

			console.log("KKKKKK", link)
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
