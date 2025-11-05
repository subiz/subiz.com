const readline = require('readline')
var crypto = require('crypto')
const {google} = require('googleapis')
const {execSync, exec} = require('child_process')
var lo = require('lodash')
var flow = require('@subiz/flow')
const fs = require('fs')
var path = require('path')
var datefns = require('date-fns')
var html2md = require('./convert.js')
var html2Block = require('./convert_block.js')
var ROOT = '1HgcqdE1utC6gAz1kGhUApCdjJD1FvtOE'
// If modifying these scopes, delete token.json.
const {standardlizeHtmlLinkToVideo} = require('./html-convert.js')

let blockM = {}
let CAT = {
	10: '2', // Làm quen với Subiz/
	110: '3', //  Xử lý tình huống/
	120: '4', // Ứng dụng nâng cao/
	20: '5', // Tích hợp kênh tương tác
	30: '6', // Tư vấn khách hàng/
	40: '7', // Quản lý làm việc nhóm/
	50: '8', // Tự động hóa/
	60: '9', // Quản lý khách hàng/
	70: '10', // Quản lý đơn hàng/
	80: '11', // Thống kê báo cáo/
	90: '12', // Tổng đài điện thoại/
}

let SCOPES = [
	'https://www.googleapis.com/auth/drive.metadata.readonly',
	'https://www.googleapis.com/auth/drive.file',
	'https://www.googleapis.com/auth/drive.readonly',
]

let drive // google drive client
//const CREDENTIALS_PATH = path.join(
//process.cwd(),
//'./client_secret_457995922934-n4qlej9o3oit2ogusn5i6gfhli4oreio.apps.googleusercontent.com.json',
//)

const CREDENTIALS_PATH = path.join(process.cwd(), './subiz-version-4-681a4d9d6092.json')

async function fetchGoogleTree() {
	let files = []
	await listFileInFolder(ROOT, files)
	// build path
	//
	var fileM = {
		[ROOT]: {
			name: 'docs',
			mimeType: 'application/vnd.google-apps.folder',
			version: '7',
			modifiedTime: '2022-05-25T08:57:08.951Z',
		},
	}
	lo.map(files, (file) => {
		if (file.id == ROOT) return
		fileM[file.id] = file
	})

	let onlyFiles = []
	lo.map(files, (file) => {
		if (file.id == ROOT) return
		let path_lowers = []
		var p = file.parents[0]
		// only care about google docs
		if (file.mimeType != 'application/vnd.google-apps.document') return
		while (p != ROOT) {
			let fileP = fileM[p]
			if (!fileP) break
			path_lowers.unshift('/' + fileP.name.trim())
			p = fileP.parents[0]
		}
		file.path_lower = path_lowers.join('') + '/' + sluggy(file.name)
		onlyFiles.push(file)
	})
	return onlyFiles
}

async function listFileInFolder(dir, files, pageToken) {
	let res = await drive.files.list({
		pageToken: pageToken,
		pageSize: 20,
		q: `'${dir}' in parents and trashed = false`,
		fields: 'nextPageToken, files(id, name,mimeType,modifiedTime,originalFilename,parents,version)',
	})

	await flow.map(
		res.data.files,
		async (file) => {
			files.push(file)
			if (file.mimeType == 'application/vnd.google-apps.folder') {
				await listFileInFolder(file.id, files)
			}
		},
		3,
	)

	if (res.data.nextPageToken) await listFileInFolder(dir, files, res.data.nextPageToken)
}

async function main() {
	let authClient = await authorize()
	drive = google.drive({version: 'v3', auth: authClient})

	ensureDirectoryExistence('./data')
	console.log('[1/5] Reading header file')
	let header = readFileHeader()
	let videoMapping = header.video_mapping || {}

	console.log(
		'Updated since',
		datefns.format(header.updated, 'yyyy-MMM-dd HH:mm'),
		'(' + datefns.formatDistanceToNow(header.updated || 1) + ')',
	)
	console.log('Last fetched', datefns.formatDistanceToNow(header.fetched || 1) + ' ago.')
	console.log('Total local files:', header.entries.length)

	let current = header.entries || []
	console.log('[2/4] Fetching Drive metadata')
	let start = Date.now()
	let hot = await fetchGoogleTree()
	console.log('Took', datefns.formatDistanceToNowStrict(start) + ', got', hot.length, 'files')

	console.log('[3/4] Merging with local file')
	let out = await diffDrive(current, hot)

	console.log('Remove', out.removes.length, 'files')
	console.log('Update', out.news.length, 'files')

	if (out.removes.length === 0 && out.news.length === 0) {
		console.log('[4/4] Updating header')
		return
		return writeFileHeader(hot, Date.now(), header.updated)
	}

	out.removes.map((entry) => {
		// protect from removing local file
		if (entry.path_lower.indexOf('/../') != -1) return console.log('malware path', entry.path_lower, ' => skip')

		console.log('REMOVING', entry.path_lower)
		fs.rmSync('./data' + entry.path_lower, {force: true})
	})
	ensureDirectoryExistence('./data')

	let docM = {}
	lo.map(hot, (entry) => {
		let out = extractFilename(entry)
		let pathlowers = entry.path_lower.split('/')
		pathlowers.pop() // remove file name
		if (out.name && out.name.startsWith('_')) {
			return // skip
		}

		docM[entry.id] = entry
	})

	if (!fs.existsSync('./raw')) fs.mkdirSync('./raw')
	if (!fs.existsSync('./block')) fs.mkdirSync('./block')

	out.news = lo.orderBy(out.news, ['id'])
	var i = 0
	await flow.map(
		out.news,
		async (entry) => {
			i++
			//			if (i > 5) return
			try {
				// if (entry.name.indexOf('20') == -1) return
				ensureDirectoryExistence('./data' + entry.path_lower)
				console.log('EXPORTING', entry.path_lower)
				await exportFile(entry.id, './data' + entry.path_lower)

				let out = extractFilename(entry)
				let pathlowers = entry.path_lower.split('/')
				pathlowers.pop() // remove file name
				if (out.name && out.name.startsWith('_')) {
					delete docM[entry.id]
					return // skip
				}

				let dataHtml = fs.readFileSync('./data' + entry.path_lower, {encoding: 'utf8'})
				// TO DO convrt dataHtml to <embedvideo src="">
				let newHtml = await standardlizeHtmlLinkToVideo(dataHtml, videoMapping)

				let markdown = await html2md(newHtml, docM, videoMapping)
				let block = await html2Block(dataHtml, docM)
				fs.writeFileSync('./raw/' + entry.id + '.html', dataHtml, {encoding: 'utf8'})
				blockM[entry.id] = block
				entry.block = block
				fs.writeFileSync('./data' + entry.path_lower, markdown, {encoding: 'utf8'})
			} catch (e) {
				console.log('EEEEEEEEEE', e)
			}
		},
		5,
	)

	// cleanEmptyFoldersRecursively('./data')

	console.log('[4/4] Updating header')
	writeFileHeader(hot, videoMapping, Date.now(), Date.now())

	console.log('[5/4] copy to docs')
	fs.rmSync('./docs', {recursive: true, force: true})
	fs.rmSync('./trainingdocs', {recursive: true, force: true})
	fs.rmSync('./i18n/en/docusaurus-plugin-content-docs/current', {recursive: true, force: true})

	let vnfilemap = {}
	lo.map(hot, (entry) => {
		let name = entry.path_lower
		let out = extractFilename(entry)
		let pathlowers = entry.path_lower.split('/')
		pathlowers.pop() // remove file name
		if (out.name && out.name.startsWith('_')) return // skip
		if (!out.locale || out.locale == 'vi' || out.locale == 'vn') {
			vnfilemap[pathlowers.join('/') + '/' + out.index] = sluggy(name) // convertToSlug(name) + '.md'
		}
	})
	console.log('FILEMAP', vnfilemap)

	lo.map(hot, (entry) => {
		let data = ''
		try {
			data = fs
				.readFileSync('./data' + entry.path_lower, {encoding: 'utf8', flag: 'r'})
				.toString()
				.trim()
		} catch (e) {}

		let name = sluggy(entry.path_lower)
		let out = extractFilename(entry)
		if (out.name && out.name.startsWith('_')) return // skip

		let fileName = './docs' + name + '.mdx'
		if (out.locale == 'en') {
			let pathlowers = entry.path_lower.split('/')
			pathlowers.pop() // remove file name
			let fpath = vnfilemap[pathlowers.join('/') + '/' + out.index]
			if (!fpath) return
			fileName = './i18n/en/docusaurus-plugin-content-docs/current' + fpath + '.mdx'
		}
		ensureDirectoryExistence(fileName)
		console.log('COPYING', fileName)

		let lines = data.split('\n')
		let title = lo.find(lines, (line) => line.startsWith('#'))
		if (!title) title = ''
		title = title.replace(/^(#)*/, '').trim() || 'https://docs.google.com/document/d/' + entry.id

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

		data =
			`---
id: ${hashCode(entry.id)}
slug: /${slug}
title: ${title}
pagination_next: null
pagination_prev: null
last_update:
  date: ${entry.modifiedTime}
---

` + data
		console.log('WRITING', fileName)
		fs.writeFileSync(fileName, data, {encoding: 'utf8'})

		let cate = entry.path_lower.substr(1).split(' ')[0]
		let article = {
			kb: 'jbsaemzffzourymgylvyhtrtn',
			i18n_title: {vi_VN: title},
			i18n_slug: {vi_VN: sluggy(title)},
			category: CAT[parseInt(cate)],
			source_id: hashCode(entry.id) + '',
			i18n_content: {vi_VN: blockM[entry.id]},
		}
		fs.writeFileSync('./block/' + hashCode(entry.id), JSON.stringify(article, null, 2), {encoding: 'utf8'})
		// fs.writeFileSync('./trainingdata/' + hashCode(entry.id) + '-' + sluggy(title) + '.md', data, {encoding: 'utf8'})

		// auto gen index directory
		let categoryIndex = genFolderIndex(categoryPath, docM)
		if (categoryIndex)
			fs.writeFileSync('./docs' + sluggy(categoryPath) + '/index.mdx', categoryIndex, {encoding: 'utf8'})
	})
	console.log('COPY RECURSIVE')
	// copyRecursiveSync('./static_docs', './docs')

	// find outdated links
	let outdated = exec(`ag "title: https:"`, {maxBuffer: 50000000}, (error, stdout, stderr) => {
		if (error) {
			console.error(`----Error: ${error.message}`)
			return
		}
		if (stderr) {
			console.error(`-----stderr: ${stderr}`)
			return
		}
		console.log(stdout)
	})
}

main()

function cleanEmptyFoldersRecursively(folder) {
	if (!fs.existsSync(folder)) return
	var isDir = fs.statSync(folder).isDirectory()
	if (!isDir) {
		return
	}
	var files = fs.readdirSync(folder)
	if (files.length > 0) {
		files.forEach(function (file) {
			var fullPath = path.join(folder, file)
			cleanEmptyFoldersRecursively(fullPath)
		})
		// re-evaluate files; after deleting subfolder
		// we may have parent folder empty now
		files = fs.readdirSync(folder)
	}

	if (files.length == 0) {
		console.log('CLEANING EMPTY FOLDER: ', folder)
		fs.rmSync(folder, {recursive: true, force: true})
		return
	}
}

function ensureDirectoryExistence(filePath) {
	var dirname = path.dirname(filePath)
	if (fs.existsSync(dirname)) return true
	ensureDirectoryExistence(dirname)
	fs.mkdirSync(dirname)
	return false
}

function unicodeToAscii(str) {
	str = str + ''
	// work around Đ not work
	str = str.replace('đ', 'd').replace('đ', 'd').replace('Đ', 'D')
	return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Look ma, it's cp -R.
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
var copyRecursiveSync = function (src, dest) {
	var exists = fs.existsSync(src)
	var stats = exists && fs.statSync(src)
	var isDirectory = exists && stats.isDirectory()
	if (isDirectory) {
		var exists = fs.existsSync(dest)
		if (!exists) fs.mkdirSync(dest)
		fs.readdirSync(src).forEach(function (childItemName) {
			copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName))
		})
	} else {
		fs.copyFileSync(src, dest)
	}
}

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

function readFileHeader() {
	let data = ''
	try {
		data = fs.readFileSync('./data/header.json', {encoding: 'utf8', flag: 'r'})
	} catch (e) {}
	let header = {version: 1, updated: 0, fetched: 0, entries: []}
	try {
		header = JSON.parse(data)
	} catch (e) {
		console.log('CORRUPTED ./data/header.json')
	}
	if (header.version != 1) return {version: 1, updated: 0, entries: []}
	return header
}

async function diffDrive(current, hot) {
	let removes = []
	let news = []
	current.map((entry) => {
		let found = hot.find((hentry) => hentry.id === entry.id)
		if (!found) return removes.push(entry)
		if (found.version != entry.version) {
			return news.push(entry)
		}
	})

	hot.map((entry) => {
		let found = current.find((centry) => centry.id === entry.id)
		if (!found) return news.push(entry)
	})

	return {removes, news}
}

async function exportFile(id, destPath) {
	const res = await drive.files.export({fileId: id, mimeType: 'text/html'}, {responseType: 'stream'})

	const dest = fs.createWriteStream(destPath)
	return new Promise((resolve, reject) => {
		res.data.on('error', reject).pipe(dest).on('error', reject).on('finish', resolve)
	})
}

function writeFileHeader(entries, videoMapping, fetched, updated) {
	entries = lo.orderBy(entries, 'id')
	entries = lo.map(entries, (entry) => {
		return {
			mimeType: entry.mimeType,
			parents: entry.parents,
			id: entry.id,
			name: entry.name,
			modifiedTime: entry.modifiedTime,
			version: entry.version,
			path_lower: entry.path_lower,
		}
	})
	fs.writeFileSync(
		'./data/header.json',
		JSON.stringify({version: 1, fetched: fetched, updated: updated, entries, video_mapping: videoMapping}, null, 2),
		{encoding: 'utf8'},
	)
}

function genFolderIndex(name, docM) {
	let sluggyname = sluggy(name)
	let links = []

	let last_updated = ''
	let index = lo.find(docM, (entry) => {
		let sluggypath = sluggy(entry.path_lower)
		if (sluggypath.indexOf(sluggyname) == 0) {
			let out = extractFilename(entry)
			if (out.name == 'index' || out.name == 'index.md' || out.name === 'index.mdx') return true
			if (entry.modifiedTime > last_updated) last_updated = entry.modifiedTime
			links.push({index: out.index, name: out.name, url: sluggypath + '.mdx'})
		}
	})
	links = lo.orderBy(links, 'index', 'asc')
	if (index) return
	let $links = lo.map(links, (link) => `* [${link.name}](${link.url})`)
	let out = extractFilename({name: name, id: Date.now()})
	let dirname = out.name || 'category'
	dirname = dirname[0].toUpperCase() + dirname.substr(1)
	return (
		`---
title: ${dirname}
pagination_next: null
pagination_prev: null
last_update:
   date: ${last_updated}
---
# ${dirname}
` + $links.join('\n')
	)
}

// check convert.js/sluggy
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

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
	const auth = new google.auth.GoogleAuth({
		keyFile: CREDENTIALS_PATH,
		scopes: SCOPES,
	})
	return auth.getClient()
}
