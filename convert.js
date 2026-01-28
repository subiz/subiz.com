var docusaunanus_config = require('./docusaurus.config.js')
const fs = require('fs')
const jsdom = require('jsdom')
var flow = require('@subiz/flow')
const {JSDOM} = jsdom
const lo = require('lodash')
const {getSlug, hashCode, sluggy} = require('./util.js')
const {standardlizeHtmlLinkToVideo} = require('./html-convert.js')

async function html2md(html, docM, videoMapping) {
	html = await standardlizeHtmlLinkToVideo(html, videoMapping)
	const dom = new JSDOM(html)
	let out = ''
	let env = {}
	await htmlMap(dom.window.document.body.childNodes, async (item, i) => {
		out += await parse(item, undefined, docM || {}, env, videoMapping || {})
	})

	out = out.trim() + '\n'
	if (env.hasEmbedVideo) out = `import EmbedVideo from '@site/src/components/EmbedVideo.js';\n\n${out}`
	return out
}

async function parse(item, format, docM, env, videoMapping) {
	if (!item) return
	if (checkTitle(item)) return parseTitle(item, docM)
	if (checkH1(item)) return parseH1(item, docM)
	if (checkH2(item)) return parseH2(item, docM)
	if (checkH3(item)) return parseH3(item, docM)
	if (checkH4(item)) return parseH4(item, docM)
	if (checkH5(item)) return parseH5(item, docM)
	if (checkVideo(item)) {
		env.hasEmbedVideo = true
		return parseEmbedVideo(item, videoMapping)
	}

	if (checkNote(item)) return parseNote(item, format, docM, env)
	if (checkCodeblock(item)) return parseCodeblock(item, docM)
	if (checkTable(item)) return parseTable(item, docM, env)
	return parsePara(item, format, docM, env)
}

// code must not contain ```
function parseCodeblock(item) {
	let code = null
	item.childNodes.forEach((tbody) => {
		if (!tbody || !tbody.tagName) return
		if (tbody.tagName.toLowerCase() !== 'tbody') return
		tbody.childNodes.forEach((tr) => {
			if (!tr || !tr.tagName) return
			if (tr.tagName.toLowerCase() !== 'tr') return
			tr.childNodes.forEach((td) => {
				if (!td || !td.tagName) return
				if (td.tagName.toLowerCase() !== 'td') return
				code = td
				return
			})
		})
	})

	return '\n```\n' + codeContent(code) + '\n```\n'
}

async function parseNote(item, format, docM, env) {
	const rows = item.rows
	const ps = item.querySelectorAll('p')
	let content = ''
	for (var i = 0; i < ps.length; i++) {
		let out = await parsePara(ps[i], format, docM, env)
		content += out.trim().replace(/:::/g, '&#58;&#58;&#58;')
		content += '\n\n'
	}
	content = content.trim() || ''
	let typ = content.split(/\s+/)[0]
	content = content.slice(typ.length).trim()
	typ = typ.split(':')[0].trim().toLowerCase()

	return `
:::${typ}
${content}
:::
`
}

async function parseTable(item, docM, env) {
	let out = ''
	await htmlMap(item.childNodes, async (tbody) => {
		if (!tbody || !tbody.tagName) return
		if (tbody.tagName.toLowerCase() !== 'tbody') return
		let firstrow = true
		let hr = '|'
		await htmlMap(tbody.childNodes, async (tr) => {
			if (!tr || !tr.tagName) return
			if (tr.tagName.toLowerCase() !== 'tr') return

			out += '|'
			await htmlMap(tr.childNodes, async (td) => {
				if (!td || !td.tagName) return
				if (td.tagName.toLowerCase() !== 'td') return

				if (firstrow) {
					hr += '--|'
				}
				let parsed = await parse(td, {singleline: true}, docM, env)
				out += trimBr(parsed.trim()) + '|'
				return
			})
			if (firstrow) {
				out += '\n' + hr
			}
			out += '\n'
			firstrow = false
		})
	})
	return '\n\n' + out
}

function codeContent(item) {
	if (!item) return ''
	if (item.childNodes.length == 0) return item.textContent
	let out = ''
	item.childNodes.forEach((child) => {
		out += codeContent(child)
	})
	if (item.tagName) {
		let tagname = item.tagName.toLowerCase()
		if (tagname == 'p') out += '\n'
	}
	return out
}

async function parsePara(item, org_format, docM, env) {
	if (!item || !item.tagName) {
		return normalize(item.textContent, org_format)
	}

	let tagname = item.tagName.toLowerCase()
	let NEWLINE = '\n'
	if (org_format && org_format.singleline) NEWLINE = '<br />'
	if (tagname == 'br') return NEWLINE + NEWLINE

	if (item.childNodes.length == 0) {
		return normalize(item.textContent, org_format)
	}
	let out = ''

	if (tagname == 'a') {
		let url = item.href || ''
		if (url.startsWith('https://www.google.com/url?')) {
			let qs = new URL(url).searchParams
			url = qs.get('q') || ''
		}

		let linkname = normalize(item.textContent, org_format)
		// https://docs.google.com/document/u/0/d/1jCYIsarPIgVlc43DW_TKXcBbFCok1-PgkJgG0t0dJfo/edit
		// https://docs.google.com/document/d/1jCYIsarPIgVlc43DW_TKXcBbFCok1-PgkJgG0t0dJfo/edit
		if (url.startsWith('https://docs.google.com/document/')) {
			let splits = url.split('/d/')
			// splits.shift()
			let doc_id = splits[1].split('/')[0]

			// let doc_id = url.substr('https://docs.google.com/document/d/'.length)
			doc_id = doc_id.split('/')[0]
			doc_id = doc_id.split('#')[0]
			doc_id = doc_id.split('?')[0]
			doc_id = doc_id.split('&')[0]
			if (docM[doc_id]) {
				let fileName = sluggy(docM[doc_id].path_lower) + '.mdx'
				return '[' + getrefdocname(linkname) || 'Link' + '](' + fileName + ')'
			}
		}

		if (linkname.trim() == '') return ' ' // google just split link into 2 part, ignore
		return '[' + linkname + '](' + url + ')'
	}

	if (tagname == 'ol' || tagname == 'ul') {
		out += NEWLINE
		let format = Object.assign({}, org_format)
		await htmlMap(item.childNodes, async (child, i) => {
			// if (!child) return
			if (!child.tagName) return
			let prefix = ''
			if (child.style.marginLeft == '72pt') prefix = '    '
			let childtagname = child.tagName.toLowerCase()
			if (childtagname == 'li') {
				let parsed = await parse(child, org_format, docM, env)
				out += NEWLINE + prefix + (tagname == 'ol' ? i + 1 + '. ' : '- ') + parsed.trim()
			}
		})
		return out
	}
	if (tagname == 'p') out += NEWLINE + NEWLINE

	await htmlMap(item.childNodes, async (child) => {
		let childTagName = ''
		if (child.tagName) childTagName = child.tagName.toLowerCase()
		if (childTagName == 'img') {
			// should upload
			let newsrc = await uploadImageToSubiz(child.src)
			out += NEWLINE + '![' + normalize(child.alt) + '](' + newsrc + ')' + NEWLINE
			return
		}

		// quote
		let format = Object.assign({}, org_format)
		let doitalic = item.tagName.toLowerCase() == 'i'
		let dobold = item.tagName.toLowerCase() == 'b'
		if (!format.italic && item.style.fontStyle == 'italic') {
			format.italic = true
			doitalic = true
		}
		if (!format.bold && item.style.fontWeight >= 500) {
			format.bold = true
			dobold = true
		}

		if (item.style.backgroundColor == 'rgb(0, 0, 0)' && item.style.color == 'rgb(255, 255, 255)') {
			format.code = true
		}

		if (format.code) {
			out += '`' + normalize(item.textContent) + '`'
			return
		}

		let ret = await parse(child, format, docM, env)
		if (doitalic) ret = '<i>' + ret + '</i>'
		// Pattern **a:**b cannot parse to <b>a:</b>b beacause pucntual character cannot followed by delitmier **
		if (dobold) ret = '<b>' + ret + '</b>'
		out += ret
	})
	return out
}

function flatOut(item) {
	if (!item) return ''
	if (item.childNodes.length == 0) return item.textContent
	let out = ''
	item.childNodes.forEach((child) => {
		out += flatOut(child)
	})
	return out
}

function parseTitle(item, docM) {
	return '\n# ' + normalize(item.textContent) + '\n'
}

function parseH1(item, docM) {
	let id = sluggy(item.textContent).trim()
	let suffix = '\n'
	if (id) suffix = ' {#' + id + '}\n'
	return '\n## ' + normalize(item.textContent) + suffix
}

function parseH2(item, docM) {
	let id = sluggy(item.textContent).trim()
	let suffix = '\n'
	if (id) suffix = ' {#' + id + '}\n'
	return '\n### ' + normalize(item.textContent) + suffix
}

function parseH3(item, docM) {
	let id = sluggy(item.textContent).trim()
	let suffix = '\n'
	if (id) suffix = ' {#' + id + '}\n'
	return '\n#### ' + normalize(item.textContent) + suffix
}

function parseH4(item, docM) {
	let id = sluggy(item.textContent).trim()
	let suffix = '\n'
	if (id) suffix = ' {#' + id + '}\n'
	return '\n##### ' + normalize(item.textContent) + suffix
}

function parseH5(item, docM) {
	let id = sluggy(item.textContent).trim()
	let suffix = '\n'
	if (id) suffix = ' {#' + id + '}\n'
	return '\n###### ' + normalize(item.textContent) + suffix
}

function parseEmbedVideo(item, videoMapping) {
	let source = item.getAttribute('data-source-url')
	let resolution = lo.get(videoMapping, [source, 'resolution']) || {}
	return `\n<EmbedVideo src="${item.getAttribute('src')}" resolution={${JSON.stringify(resolution)}}/>`
}

function checkTitle(item, docM) {
	if (!item.classList) return false
	if (item.classList.contains('title')) return true
}

function checkH1(item) {
	if (!item.tagName) return false
	return item.tagName.toLowerCase() == 'h1'
}

function checkVideo(item) {
	if (!item.tagName) return false
	return item.tagName.toLowerCase() == 'embedvideo'
}

function checkH2(item) {
	if (!item.tagName) return false
	return item.tagName.toLowerCase() == 'h2'
}

function checkH3(item) {
	if (!item.tagName) return false
	return item.tagName.toLowerCase() == 'h3'
}

function checkH4(item) {
	if (!item.tagName) return false
	return item.tagName.toLowerCase() == 'h4'
}

function checkH5(item) {
	if (!item.tagName) return false
	return item.tagName.toLowerCase() == 'h5'
}

function checkCodeblock(item) {
	if (!item.tagName) return false
	if (item.tagName.toLowerCase() !== 'table') return false

	let ncell = 0
	item.childNodes.forEach((tbody) => {
		if (!tbody || !tbody.tagName) return
		if (tbody.tagName.toLowerCase() !== 'tbody') return
		tbody.childNodes.forEach((tr) => {
			if (!tr || !tr.tagName) return
			if (tr.tagName.toLowerCase() !== 'tr') return
			tr.childNodes.forEach((td) => {
				if (!td || !td.tagName) return
				if (td.tagName.toLowerCase() !== 'td') return
				ncell++
			})
		})
	})
	return ncell == 1
}

function checkTable(item) {
	if (!item.tagName) return false
	if (item.tagName.toLowerCase() !== 'table') return false

	let ncell = 0
	item.childNodes.forEach((tbody) => {
		if (!tbody || !tbody.tagName) return
		if (tbody.tagName.toLowerCase() !== 'tbody') return
		tbody.childNodes.forEach((tr) => {
			if (!tr || !tr.tagName) return
			if (tr.tagName.toLowerCase() !== 'tr') return
			tr.childNodes.forEach((td) => {
				if (!td || !td.tagName) return
				if (td.tagName.toLowerCase() !== 'td') return
				ncell++
			})
		})
	})
	return ncell > 1
}

function checkNote(item) {
	// <table><tr><td>Note:</td></tr></table>
	if (!item.tagName) return false
	if (item.tagName.toLowerCase() !== 'table') return false

	const rows = item.rows
	if (rows.length !== 1) return false
	if (rows[0].cells.length !== 1) return false //

	const text = item.rows[0].cells[0].textContent.toLowerCase().trim()
	if (
		text.startsWith('note') ||
		text.startsWith('tip') ||
		text.startsWith('info') ||
		text.startsWith('warning') ||
		text.startsWith('danger')
	) {
		return true
	}
	return false
}

function normalize(text, format) {
	let str = text
		.replace(/\\/g, '\\\\') // Backslash (must be first)
		.replace(/\{/g, '\\{') // Opening brace
		.replace(/\}/g, '\\}') // Closing brace
		.replace(/\*/g, '\\*') // Asterisk
		.replace(/_/g, '\\_') // Underscore
		.replace(/\[/g, '\\[') // Opening bracket
		.replace(/\]/g, '\\]') // Closing bracket
		.replace(/\(/g, '\\(') // Opening paren
		.replace(/\)/g, '\\)') // Closing paren
		.replace(/#/g, '\\#') // Hash
		.replace(/!/g, '\\!') // Exclamation
		.replace(/`/g, '\\`') // Backtick

	// receive text
	str = str || ''
	str = str.replace(/[\t\r\n]/gm, ' ')
	str = str.replace(/\s\s+/g, ' ')
	str = str.replace(/>/g, '&gt;')
	str = str.replace(/</g, '&lt;')
	str = str.replace(/\|/g, '\\|')
	if (format && format.singleline) {
		str = str.replace(/\r\n|\r|\n/g, '<br />')
	}

	return str
}

function trimBr(str) {
	while (true) {
		newstr = str.replace(/^\<br \/\>/, '')
		newstr = newstr.replace(/^\<br\/\>/, '')
		newstr = newstr.replace(/^\<br\>/, '')

		newstr = newstr.replace(/\<br \/\>$/, '')
		newstr = newstr.replace(/\<br\/\>$/, '')
		newstr = newstr.replace(/\<br\>$/, '')

		if (newstr == str) break
		str = newstr
	}
	return str
}

async function uploadImageToSubiz(url) {
	try {
		let resp = await fetch('https://api5.subiz.com.vn/4.0/accounts/acpxkgumifuoofoosble/files/url/download', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({account_id: 'acpxkgumifuoofoosble', url}),
		})

		if (!resp.ok) throw new Error(`Upload failed: HTTP ${resp.status}`)

		let out = await resp.json()
		if (!out.url) throw new Error('Upload failed: no url returned')

		return out.url
	} catch (e) {
		console.log(url)
		throw e // do not return input url
	}
}

function htmlMap(dom, f, n) {
	let items = []
	dom.forEach((item) => items.push(item))
	return flow.map(items, f, n)
}

function getrefdocname(name) {
	let ns = name.split('.')
	if (ns.length == 1) {
		return name.trim()
	}

	ns.shift()
	return ns.join(name, '.').trim()
}

module.exports = html2md
