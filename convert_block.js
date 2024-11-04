const fs = require('fs')
const jsdom = require('jsdom')
var lo = require('lodash')
var flow = require('@subiz/flow')
const {JSDOM} = jsdom

async function html2block(html, docM) {
	const dom = new JSDOM(html)
	let out = []
	await htmlMap(dom.window.document.body.childNodes, async (item, i) => {
		let ret = await parse(item, undefined, docM || {})
		if (ret) out.push(ret)
	})
	out = out.filter((ret) => ret)
	// remove file ending new line
	if (out.length > 1) {
		let last = out[out.length - 1]
		if (last.type == 'text' && !last.text.trim()) out.pop()
	}

	if (out.length == 1 && out[0].type == 'paragraph') return out[0]
	return {type: 'div', content: out}
}

async function parse(item, format, docM) {
	if (!item) return
	if (checkTitle(item)) return parseTitle(item, docM)
	if (checkH1(item)) return parseHeading(1, item, docM)
	if (checkH2(item)) return parseHeading(2, item, docM)
	if (checkH3(item)) return parseHeading(3, item, docM)
	if (checkH4(item)) return parseHeading(4, item, docM)
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

	return {
		type: 'pre',
		content: [codeContent(code)],
	}
}

async function parseTable(item, docM) {
	let rows = []
	await htmlMap(item.childNodes, async (tbody) => {
		if (!tbody || !tbody.tagName) return
		if (tbody.tagName.toLowerCase() !== 'tbody') return
		await htmlMap(tbody.childNodes, async (tr) => {
			if (!tr || !tr.tagName) return
			if (tr.tagName.toLowerCase() !== 'tr') return

			let cells = []
			let row = {
				type: 'table_row',
				content: cells,
			}
			await htmlMap(tr.childNodes, async (td) => {
				if (!td || !td.tagName) return
				if (td.tagName.toLowerCase() !== 'td') return

				let parsed = await parse(td, {singleline: true}, docM)

				cells.push({
					type: 'table_cell',
					colspan: 1,
					rowspan: 1,
					content: [parsed],
				})
				return
			})
			rows.push(row)
		})
	})
	return {type: 'table', content: rows}
}

function codeContent(item) {
	if (!item) return
	if (item.childNodes.length == 0) {
		let text = item.textContent
		if (text) return {type: 'text', text: text}
		return null
	}
	let out = ''
	let par = {
		type: 'paragraph',
		content: [],
	}
	item.childNodes.forEach((child) => {
		let content = codeContent(child)
		if (content) par.content.push(content)
	})
	return par
}

async function parsePara(item, org_format, docM) {
	if (!item || !item.tagName) {
		let text = normalize(item.textContent, org_format)
		if (text) return {type: 'text', text: text}
		return null
	}
	let tagname = item.tagName.toLowerCase()
	if (tagname == 'br') return null // {type: 'paragraph'}

	if (item.childNodes.length == 0) {
		let text = normalize(item.textContent, org_format)
		if (text) return {type: 'text', text: text}
		return null
	}
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
				return {
					type: 'link',
					href: fileName,
					title: normalize(item.textContent, org_format) || url,
					text: normalize(item.textContent, org_format) || url,
					target: '_blank',
				}
			}
		}
		return {
			type: 'link',
			href: url,
			title: normalize(item.textContent, org_format) || url,
			text: normalize(item.textContent, org_format) || url,
			target: '_blank',
		}
	}

	if (tagname == 'li') {
		let childs = []
		await htmlMap(item.childNodes, async (child, i) => {
			// if (!child) return
			if (!child.tagName) return
			let parsed = await parse(child, org_format, docM)
			if (parsed) childs.push(parsed)
		})

		if (childs.length == 1 && childs[0].type == 'paragraph')
			return {
				type: 'list_item',
				content: childs,
			}

		return {
			type: 'list_item',
			content: [{type: 'paragraph', content: childs}],
		}
	}

	if (tagname == 'ol' || tagname == 'ul') {
		let format = Object.assign({}, org_format)
		let childs = []
		await htmlMap(item.childNodes, async (child, i) => {
			// if (!child) return
			if (!child.tagName) return
			let parsed = await parse(child, org_format, docM)
			if (parsed) childs.push(parsed)
		})

		return {
			type: tagname == 'ol' ? 'ordered_list' : 'bullet_list',
			content: childs,
		}
	}

	let out = []

	let childs = out
	if (tagname == 'p') {
		out = [
			{
				type: 'paragraph',
				content: childs,
			},
		]
	}

	await htmlMap(item.childNodes, async (child) => {
		let childTagName = ''
		if (child.tagName) childTagName = child.tagName.toLowerCase()
		if (childTagName == 'img') {
			let newsrc = await uploadImageToSubiz(child.src)
			childs.push({
				type: 'image',
				alt_text: normalize(child.alt),
				image: {url: newsrc},
			})
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
			let text = normalize(item.textContent)
			if (text)
				childs.push({
					type: 'text',
					text: text,
					code: true,
				})
			return
		}

		let ret = await parse(child, format, docM)
		if (!ret) return
		if (doitalic) ret.italic = true
		if (dobold) ret.bold = true
		childs.push(ret)
	})

	if (childs.length > 1) {
		return {
			type: 'paragraph',
			content: childs,
		}
	}

	return out[0]
}

function parseTitle(item, docM) {
	return {
		type: 'heading',
		level: 1,
		content: [{type: 'text', text: normalize(item.textContent) || ' '}],
	}
}

function parseHeading(level, item, docM) {
	return {
		type: 'heading',
		level: level,
		content: [
			{
				type: 'text',
				text: normalize(item.textContent) || ' ',
			},
		],
	}
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
	str = str.replace(/\[/g, '\\[')
	str = str.replace(/\]/g, '\\]')
	str = str.replace(/\|/g, '\\|')
	str = str.replace(/`/g, '\\`')
	if (format && format.singleline) {
		str = str.replace(/\r\n|\r|\n/g, '<br />')
	}
	return lo.trim(str)
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

module.exports = html2block
