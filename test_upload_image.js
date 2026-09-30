const assert = require('node:assert/strict')
const {test} = require('node:test')
const upload = require('./upload-image.js')
const convert = require('./html2block2md.js')
const asyncMap = require('./async-map.js')

test('upload failures reject conversion instead of embedding the source', async () => {
	const originalFetch = global.fetch
	const source = 'data:image/png;base64,aGVsbG8='
	try {
		for (const response of [
			{ok: false, status: 500},
			{ok: true, json: async () => ({})},
			{ok: true, json: async () => ({url: source})},
			{ok: true, json: async () => { throw new Error('Invalid JSON') }},
		]) {
			global.fetch = async () => response
			for (const tag of ['p', 'h1']) {
				await assert.rejects(convert(`<${tag}><img src="${source}">Text</${tag}>`), /Image upload failed/)
			}
		}
		global.fetch = async () => { throw new Error('Network unavailable') }
		await assert.rejects(upload(source), (error) => {
			assert.match(error.message, /Network unavailable/)
			assert.ok(!error.message.includes('aGVsbG8='))
			return true
		})
		global.fetch = async () => ({ok: true, json: async () => ({url: 'https://example.com/image.png'})})
		const markdown = await convert(`<p><img src="${source}"></p>`)
		assert.ok(markdown.includes('https://example.com/image.png'))
		assert.ok(!markdown.includes('data:image'))
	} finally {
		global.fetch = originalFetch
	}
})

test('async map propagates failure and stops scheduling more work', async () => {
	const visited = []
	await assert.rejects(asyncMap([1, 2, 3], async (value) => {
		visited.push(value)
		throw new Error('Upload failed')
	}), /Upload failed/)
	assert.deepEqual(visited, [1])
})
