const fs = require('fs')
const jsdom = require('jsdom')
var flow = require('@subiz/flow')
const html = fs.readFileSync('./full.html', 'utf8')
const {JSDOM} = jsdom

async function html2md(html, docM) {
	const dom = new JSDOM(html)
	let out = ''
	await htmlMap(dom.window.document.body.childNodes, async (item, i) => {
		out += await parse(item, undefined, docM || {})
	})

	return out.trim() + '\n'
}

async function parse(item, format, docM) {
	if (!item) return
	if (checkTitle(item)) return parseTitle(item, docM)
	if (checkH1(item)) return parseH1(item, docM)
	if (checkH2(item)) return parseH2(item, docM)
	if (checkH3(item)) return parseH3(item, docM)
	if (checkH4(item)) return parseH4(item, docM)
	if (checkCodeblock(item)) return parseCodeblock(item, docM)
	if (checkTable(item)) return parseTable(item, docM)
	return parsePara(item, format, docM)
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

async function parseTable(item, docM) {
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
				let parsed = await parse(td, {singleline: true}, docM)
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

async function parsePara(item, org_format, docM) {
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
		if (url.startsWith('https://docs.google.com/document/d/')) {
			let doc_id = url.substr('https://docs.google.com/document/d/'.length)
			doc_id = doc_id.split('/')[0]
			doc_id = doc_id.split('#')[0]
			if (docM[doc_id]) {
				let fileName = sluggy(docM[doc_id].path_lower) + '.md'
				return '[' + (normalize(item.textContent, org_format) || url) + '](' + fileName + ')'
			}
		}
		return '[' + (normalize(item.textContent, org_format) || url) + '](' + url + ')'
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
				let parsed = await parse(child, org_format, docM)
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
		let doitalic = false
		let dobold = false
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

		let ret = await parse(child, format, docM)
		if (doitalic) ret = '*' + ret + '*'
		if (dobold) ret = '**' + ret + '**'
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
	return '\n## ' + normalize(item.textContent) + '\n'
}

function parseH2(item, docM) {
	return '\n### ' + normalize(item.textContent) + '\n'
}

function parseH3(item, docM) {
	return '\n#### ' + normalize(item.textContent) + '\n'
}

function parseH4(item, docM) {
	return '\n##### ' + normalize(item.textContent) + '\n'
}

function checkTitle(item, docM) {
	if (!item.classList) return false
	if (item.classList.contains('title')) return true
}

function checkH1(item) {
	if (!item.tagName) return false
	return item.tagName.toLowerCase() == 'h1'
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

function normalize(str, format) {
	// receive text
	str = str || ''
	str = str.replace(/[\t\r\n]/gm, ' ')
	str = str.replace(/\s\s+/g, ' ')

	str = str.replace(/\*/g, '\\*')
	str = str.replace(/\_/g, '\\_')
	str = str.replace(/>/g, '&gt;')
	str = str.replace(/</g, '&lt;')
	str = str.replace(/\[/g, '\\[')
	str = str.replace(/\]/g, '\\]')
	str = str.replace(/\|/g, '\\|')
	str = str.replace(/`/g, '\\`')
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

// check ./driveapi.js/sluggy
function sluggy(name) {
	name = name || ''
	return unicodeToAscii(name.toLowerCase().trim().replaceAll('?', '-').replaceAll(' ', '-').replaceAll('!', '-'))
}

function unicodeToAscii(str) {
	str = str + ''
	// work around Đ not work
	str = str.replace('đ', 'd').replace('Đ', 'D')
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

async function uploadImageToSubiz(url) {
	try {
		let resp = await fetch('https://api.subiz.com.vn/4.0/accounts/acpxkgumifuoofoosble/files/url/download', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({account_id: 'acpxkgumifuoofoosble', url: url}),
		})

		let out = await resp.json()
		return out.url || url
	} catch (e) {
		return url
	}
}

function htmlMap(dom, f, n) {
	let items = []
	dom.forEach((item) => items.push(item))
	return flow.map(items, f, n)
}

module.exports = html2md
