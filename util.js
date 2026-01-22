/*
	subiz la gi => { name: subiz la gi, locale: ''}
	1. subiz la gi => { index: 1, name: subiz la gi, locale: ''}
	1 subiz la gi => {name: subiz la gi, locale: ''}
	1.1 subiz la gi  => { name: subiz la gi, locale: ''}
	1.subiz la gi => { name: subiz la gi, locale: ''}

	en.subiz la gi => { name: subiz la gi, locale: 'en'}
	1.en subiz la gi => { name: subiz la gi, locale: 'en'}
	1en subiz la gi => { name: subiz la gi, locale: 'en'}
	1en. subiz la gi => {name: subiz la gi, locale: 'en'}
	1.1.en. subiz la gi => {name: subiz la gi, locale: 'en'}
	1.1en.subiz la gi => { name: subiz la gi, locale: ''}
*/

function extractFilename(entry) {
	let str = entry.name || ''
	if (str.startsWith('/')) str = str.substr(1)
	str = str.trim()
	let strsplit = str.split(' ')
	let index = strsplit.shift()
	let name = strsplit.join(' ')

	// find locale in index
	let invalidindex = index.length
	for (var i = 0; i < index.length; i++) {
		let c = index.charAt(i)
		if (c >= '0' && c <= '9') continue
		if (c == '.') continue
		invalidindex = i
		break
	}
	let indexNum = index.substr(0, invalidindex)

	let locale
	let textInIndex = index.substr(invalidindex)
	if (textInIndex.startsWith('en')) {
		textInIndex = textInIndex.substr(2)
		locale = 'en'
	}
	if (textInIndex.startsWith('vi') || textInIndex.startsWith('vn')) {
		locale = textInIndex.substr(0, 2)
		textInIndex = textInIndex.substr(2)
	}
	if (textInIndex.startsWith('.')) textInIndex = textInIndex.substr(1)
	name = textInIndex + ' ' + name
	return {
		slug: hashCode(entry.id) + '-' + sluggy(name),
		name: name.trim(),
		locale,
		index: Math.round((indexNum || 0) * 100),
	}
}

function unicodeToAscii(str) {
	str = str + ''
	// work around Đ not work
	str = str.replace('đ', 'd').replace('đ', 'd').replace('Đ', 'D')
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function sluggy(name) {
	name = name || ''

	let slug = unicodeToAscii(name.toLowerCase().trim())

	// Allow only letters, numbers, hyphens, and slashes
	slug = slug.replace(/[^a-z0-9/-]+/g, '-')

	// Collapse multiple hyphens (but not slashes)
	slug = slug.replace(/-+/g, '-')

	// Remove leading/trailing hyphens or slashes
	slug = slug.replace(/^[-]+|[-]+$/g, '')

	return slug
}

function hashCode(str) {
	var hash = 0,
		i,
		chr
	if (str.length === 0) return hash
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}
	return Math.abs(hash)
}

function getSlug(entry) {
	let out = extractFilename(entry)
	// generate index for a category
	let pathlowers = entry.path_lower.split('/')
	pathlowers.pop() // remove file name
	let categoryPath = pathlowers.join('/')

	let slug = out.slug
	if (out.name == 'index' || out.name == 'index.md' || out.name === 'index.mdx') {
		let out = extractFilename({name: categoryPath, id: Date.now()})
		let dirname = out.name || 'category'
		slug = hashCode(entry.id) + '-' + sluggy(dirname)
		if (!categoryPath) slug = '' // the main index
	}
	return slug
}

module.exports = {
	sluggy,
	getSlug,
	hashCode,
	extractFilename,
	unicodeToAscii,
}
