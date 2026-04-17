const fs = require('fs')
const jsdom = require('jsdom')
var lo = require('lodash')
var flow = require('@subiz/flow')
const {JSDOM} = jsdom
const {getSlug, hashCode, sluggy} = require('./util.js')

async function html2block(html, docM) {
	const dom = new JSDOM(html)
	let out = []
	await htmlMap(dom.window.document.body.childNodes, async (item, i) => {
		let ret = await parse(item, undefined, docM || {})
		if (ret) {
			if (Array.isArray(ret)) {
				ret.forEach((r) => {
					if (r.type === 'text' && !r.text.trim()) return
					out.push(r)
				})
			} else {
				if (ret.type === 'text' && !ret.text.trim()) return
				out.push(ret)
			}
		}
	})
	out = out.filter((ret) => ret)
	// remove file ending new line
	if (out.length > 1) {
		let last = out[out.length - 1]
		if (last.type == 'text' && !last.text.trim()) out.pop()
	}

	if (out.length == 1) return out[0]
	if (out.length > 0 && out.every((b) => b.type === 'paragraph')) return {type: 'paragraph', content: out}
	return {type: 'div', content: out}
}

async function parse(item, format, docM) {
	if (!item) return
	if (checkTitle(item)) return await parseTitle(item, docM)
	if (checkH1(item)) return await parseHeading(1, item, docM)
	if (checkH2(item)) return await parseHeading(2, item, docM)
	if (checkH3(item)) return await parseHeading(3, item, docM)
	if (checkH4(item)) return await parseHeading(4, item, docM)
	if (checkH5(item)) return await parseHeading(5, item, docM)
	if (checkVideo(item)) return parseEmbedVideo(item)
	if (checkNote(item)) return await parseNote(item, format, docM)
	if (checkPre(item)) return parsePre(item)
	if (checkCodeblock(item)) return parseCodeblock(item, docM)
	if (checkTable(item)) return await parseTable(item, docM)
	return await parsePara(item, format, docM)
}

function checkPre(item) {
	if (!item.tagName) return false
	return item.tagName.toLowerCase() == 'pre'
}

function parsePre(item) {
	return {
		type: 'pre',
		content: [{type: 'text', text: codeContent(item).trim()}],
	}
}

function parseEmbedVideo(item) {
	return {
		type: 'embed-video',
		src: item.getAttribute('src'),
		sourceUrl: item.getAttribute('data-source-url'),
	}
}

async function parseNote(item, format, docM) {
	const ps = item.querySelectorAll('p')
	let content = []
	for (let i = 0; i < ps.length; i++) {
		let out = await parsePara(ps[i], format, docM)
		if (out) {
			if (Array.isArray(out)) content.push(...out)
			else content.push(out)
		}
	}

	let firstText = ''
	for (let block of content) {
		if (block.type === 'text') {
			firstText = block.text.toLowerCase().trim()
			break
		}
		if (block.type === 'paragraph' && block.content && block.content[0] && block.content[0].type === 'text') {
			firstText = block.content[0].text.toLowerCase().trim()
			break
		}
	}

	let typ = 'note'
	if (firstText.startsWith('note')) typ = 'note'
	else if (firstText.startsWith('tip')) typ = 'tip'
	else if (firstText.startsWith('info')) typ = 'info'
	else if (firstText.startsWith('warning')) typ = 'warning'
	else if (firstText.startsWith('danger')) typ = 'danger'

	// Remove the type prefix from the first text block
	for (let block of content) {
		let target = null
		if (block.type === 'text') target = block
		else if (block.type === 'paragraph' && block.content && block.content[0] && block.content[0].type === 'text')
			target = block.content[0]

		if (target) {
			let t = target.text.trim()
			if (t.toLowerCase().startsWith(typ)) {
				target.text = t.slice(typ.length).replace(/^[:\s]+/, '')
			}
			break
		}
	}

	return {
		type: 'note',
		noteType: typ,
		content: content,
	}
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
		content: [{type: 'text', text: codeContent(code).trim()}],
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
					content: Array.isArray(parsed) ? parsed : [parsed],
				})
				return
			})
			rows.push(row)
		})
	})
	return {type: 'table', content: rows}
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
		if (tagname == 'p' || tagname == 'br') out += '\n'
	}
	return out
}

async function parsePara(item, org_format, docM) {
	if (!item || !item.tagName) {
		let text = normalize(item.textContent, org_format)
		if (text) return {type: 'text', text: text}
		return null
	}
	let tagname = item.tagName.toLowerCase()
	if (tagname == 'br') return {type: 'text', text: '\n\n'}

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
					title: normalize(item.textContent, org_format).trim() || url,
					text: normalize(item.textContent, org_format).trim() || url,
					target: '_blank',
				}
			}
		}
		return {
			type: 'link',
			href: url,
			title: normalize(item.textContent, org_format).trim() || url,
			text: normalize(item.textContent, org_format).trim() || url,
			target: '_blank',
		}
	}

	if (tagname == 'li') {
		let childs = []
		await htmlMap(item.childNodes, async (child, i) => {
			// if (!child) return
			if (!child.tagName && !child.textContent.trim()) return
			let parsed = await parse(child, org_format, docM)
			if (parsed) {
				if (Array.isArray(parsed)) childs.push(...parsed)
				else childs.push(parsed)
			}
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
		let childs = []
		await htmlMap(item.childNodes, async (child, i) => {
			// if (!child) return
			if (!child.tagName && !child.textContent.trim()) return
			let parsed = await parse(child, org_format, docM)
			if (parsed) {
				if (Array.isArray(parsed)) childs.push(...parsed)
				else childs.push(parsed)
			}
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
			let newsrc = child.src
			try {
				newsrc = await uploadImageToSubiz(child.src)
			} catch (e) {
				console.error('Failed to upload image:', child.src, e.message)
			}
			let imgBlock = {
				type: 'image',
				image: {url: newsrc},
			}
			let alt = normalize(child.alt)
			if (alt) imgBlock.alt_text = alt
			childs.push(imgBlock)
			return
		}

		// quote
		let format = Object.assign({}, org_format)
		let doitalic = item.tagName.toLowerCase() == 'i'
		let dobold = item.tagName.toLowerCase() == 'b'
		let dounderline = false
		if (!format.italic && item.style.fontStyle == 'italic') {
			format.italic = true
			doitalic = true
		}
		if (!format.bold && item.style.fontWeight >= 500) {
			format.bold = true
			dobold = true
		}
		if (!format.underline && item.style.textDecoration === 'underline' && childTagName !== 'a') {
			format.underline = true
			dounderline = true
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
		if (Array.isArray(ret)) {
			ret.forEach((r) => {
				if (doitalic) r.italic = true
				if (dobold) r.bold = true
				if (dounderline) r.underline = true
			})
			childs.push(...ret)
		} else {
			if (doitalic) ret.italic = true
			if (dobold) ret.bold = true
			if (dounderline) ret.underline = true
			childs.push(ret)
		}
	})

	// Trim leading and trailing whitespace-only text blocks or br tags
	if (tagname === 'p') {
		while (childs.length > 0) {
			let first = childs[0]
			if (first.type === 'text' && (!first.text.trim() || first.text === '\n\n')) {
				childs.shift()
			} else {
				break
			}
		}
		while (childs.length > 0) {
			let last = childs[childs.length - 1]
			if (last.type === 'text' && (!last.text.trim() || last.text === '\n\n')) {
				childs.pop()
			} else {
				break
			}
		}
	}

	if (childs.length > 1) {
		if (tagname !== 'p') return childs
		return {
			type: 'paragraph',
			content: childs,
		}
	}

	return out[0]
}

async function parseTitle(item, docM) {
	let blocks = await extractImagesFromHeading(item)
	blocks.push({
		type: 'heading',
		level: 1,
		isTitle: true,
		content: [{type: 'text', text: normalize(item.textContent).trim() || ' '}],
	})
	return blocks
}

async function parseHeading(level, item, docM) {
	let blocks = await extractImagesFromHeading(item)
	blocks.push({
		type: 'heading',
		level: level,
		content: [
			{
				type: 'text',
				text: normalize(item.textContent).trim() || ' ',
			},
		],
	})
	return blocks
}

async function extractImagesFromHeading(item) {
	let images = []
	let queue = [item]
	while (queue.length > 0) {
		let node = queue.shift()
		if (node.tagName && node.tagName.toLowerCase() === 'img') {
			images.push(node)
		}
		if (node.childNodes) {
			for (let i = 0; i < node.childNodes.length; i++) {
				queue.push(node.childNodes[i])
			}
		}
	}

	let blocks = []
	for (let img of images) {
		let newsrc = img.src
		try {
			newsrc = await uploadImageToSubiz(img.src)
		} catch (e) {
			console.error('Failed to upload image:', img.src, e.message)
		}
		let imgBlock = {
			type: 'image',
			image: {url: newsrc},
		}
		let alt = normalize(img.alt)
		if (alt) imgBlock.alt_text = alt
		blocks.push(imgBlock)
	}
	return blocks
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

function checkH5(item) {
	if (!item.tagName) return false
	return item.tagName.toLowerCase() == 'h5'
}

function checkVideo(item) {
	if (!item.tagName) return false
	return item.tagName.toLowerCase() == 'embedvideo'
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

function normalize(text, format) {
	if (typeof text !== 'string') return ''
	let str = text.replace(/[\t\r\n]/gm, ' ').replace(/\s\s+/g, ' ')
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
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 20000)
		console.log('UPLOAD', url.slice(0, 100))
		let resp = await fetch('https://api.subiz.com.vn/4.0/accounts/acpxkgumifuoofoosble/files/url/download', {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({account_id: 'acpxkgumifuoofoosble', url: url}),
			signal: controller.signal,
		})
		clearTimeout(timeoutId)

		let out = await resp.json()
		return out.url || url
	} catch (e) {
		console.log('EEEEEEE', e)
		return url
	}
}

function htmlMap(dom, f, n) {
	let items = []
	dom.forEach((item) => items.push(item))
	return flow.map(items, f, n)
}

module.exports = html2block
