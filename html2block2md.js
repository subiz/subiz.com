const html2block = require('./convert_block.js')
const block2md = require('./block2md.js')
const {standardlizeHtmlLinkToVideo} = require('./html-convert.js')

async function html2block2md(html, docM, videoMapping) {
	html = await standardlizeHtmlLinkToVideo(html, videoMapping)
	const block = await html2block(html, docM)
	const markdown = block2md(block, {docM, videoMapping})
	return markdown
}

module.exports = html2block2md
