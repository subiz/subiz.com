const lo = require('lodash')
const {sluggy} = require('./util.js')

function normalize(text, format) {
	if (typeof text !== 'string') return ''
	if (format && format.noEscape) return text

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
		str = str.replace(/\r\n|\r|\n/g, '<br/>')
	}

	return str
}

function getBlockText(block) {
	if (!block) return ''
	if (Array.isArray(block)) return block.map(getBlockText).join('')
	if (block.type === 'text') return block.text || ''
	if (block.content) return getBlockText(block.content)
	return ''
}

function checkNote(block, options) {
	if (block.type !== 'table') return false
	if (!block.content || block.content.length !== 1) return false
	let row = block.content[0]
	if (!row.content || row.content.length !== 1) return false
	let cell = row.content[0]
	let text = block2md(cell.content, {...options, singleline: true}).toLowerCase().trim()
	return (
		text.startsWith('note') ||
		text.startsWith('tip') ||
		text.startsWith('info') ||
		text.startsWith('warning') ||
		text.startsWith('danger')
	)
}

function block2md(block, options = {}) {
	if (!block) return ''

	if (Array.isArray(block)) {
		return block.map((b) => block2md(b, options)).join('')
	}

	switch (block.type) {
		case 'text': {
			let text = block.text || ''
			if (text !== '\n\n') {
				text = normalize(text, options)
			}
			if (block.code) text = `\`${text}\``
			if (block.italic) text = `<i>${text}</i>`
			if (block.bold) text = `<b>${text}</b>`
			if (block.underline) text = `<u>${text}</u>`
			if (block.strike) text = `~~${text}~~`
			return text
		}

		case 'paragraph': {
			let content = block2md(block.content, options).trim()
			if (!content) return ''
			if (options.singleline) return content + '\n'
			return '\n\n' + content + '\n\n'
		}

		case 'div': {
			let content = block2md(block.content, options)
			return content
		}

		case 'heading': {
			let level = block.level || 1
			let content = block2md(block.content, options).trim()
			if (!content) return ''
			let id = sluggy(content).trim()
			let suffix = ''

			let actualLevel = level
			if (block.isTitle) {
				actualLevel = 1
			} else {
				actualLevel = level + 1 // Shift H1 to ##, H2 to ###, etc.
				if (id) suffix = ' {#' + id + '}'
			}

			if (actualLevel > 6) actualLevel = 6
			return '\n\n' + '#'.repeat(actualLevel) + ' ' + content + suffix + '\n\n'
		}

		case 'blockquote': {
			let content = block2md(block.content, options).trim()
			return '\n\n> ' + content.replace(/\n/g, '\n> ') + '\n\n'
		}

		case 'bullet_list':
			return '\n\n' + block.content.map((li) => block2md(li, {...options, listType: 'ul'})).join('\n') + '\n\n'

		case 'ordered_list':
			return '\n\n' + block.content.map((li, i) => block2md(li, {...options, listType: 'ol', index: i + 1})).join('\n') + '\n\n'

		case 'list_item': {
			let prefix = options.listType === 'ol' ? `${options.index || 1}. ` : '- '
			let content = block2md(block.content, options).trim()
			return prefix + content.replace(/\n/g, '\n  ')
		}

		case 'horizontal_rule':
			return '\n\n---\n\n'

		case 'image': {
			let alt = block.alt_text || ''
			alt = normalize(alt, options)
			let url = lo.get(block, 'image.url') || ''
			return `![${alt}](${url})`
		}

		case 'link': {
			let linkText = block.text || block.title || block.href
			linkText = normalize(linkText, options)
			return `[${linkText}](${block.href})`
		}

		case 'pre': {
			return '\n\n```\n' + block2md(block.content, {...options, noEscape: true}).trim() + '\n```\n\n'
		}

		case 'table': {
			if (checkNote(block, options)) {
				let cellContent = block.content[0].content[0].content
				let content = block2md(cellContent, options).trim()
				content = content.replace(/:::/g, '&#58;&#58;&#58;')
				let typ = content.split(/\s+/)[0]
				content = content.slice(typ.length).trim()
				typ = typ.split(':')[0].trim().toLowerCase()
				return `\n\n:::${typ}\n${content}\n:::\n\n`
			}
			if (!block.content || block.content.length === 0) return ''
			let rows = block.content.map((row) => {
				return (
					'| ' +
					(row.content || [])
						.map((cell) => {
							let res = block2md(cell.content, { ...options, singleline: true }).trim()
							return res.replace(/\n/g, '<br/>')
						})
						.join(' | ') +
					' |'
				)
			})
			if (rows.length === 0) return ''
			let headerCount = (block.content[0].content || []).length
			let separator = '| ' + Array(headerCount).fill('---').join(' | ') + ' |'
			return '\n\n' + rows[0] + '\n' + separator + '\n' + rows.slice(1).join('\n') + '\n\n'
		}

		case 'note': {
			let typ = block.noteType || 'note'
			let content = block2md(block.content, options).trim()
			return `\n\n:::${typ}\n${content}\n:::\n\n`
		}

		case 'embed-video': {
			if (options.env) options.env.hasEmbedVideo = true
			let resolution = lo.get(options.videoMapping, [block.sourceUrl, 'resolution']) || {}
			return `\n\n<EmbedVideo src="${block.src}" resolution={${JSON.stringify(resolution)}}/>\n\n`
		}

		case 'dynamic-field':
			return `{{${block.text}}}`

		case 'emoji':
			return `:${block.text}:`

		case 'mention':
			return `@${lo.get(block, 'attrs.name', 'someone')}`

		default:
			if (block.content) return block2md(block.content, options)
			return ''
	}
}

function convert(block, options = {}) {
	let env = {hasEmbedVideo: false}
	let out = block2md(block, {...options, env})

	// Clean up spaces at ends of lines
	out = out
		.split('\n')
		.map((line) => line.trimEnd())
		.join('\n')

	// Clean up multiple consecutive newlines
	out = out.replace(/\n{3,}/g, '\n\n').trim() + '\n'
	if (env.hasEmbedVideo) {
		out = `import EmbedVideo from '@site/src/components/EmbedVideo.js';\n\n${out}`
	}
	return out
}

module.exports = convert
