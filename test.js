const assert = require('assert')
const fs = require('fs')
const html2block = require('./convert_block.js')

describe('html2block', function () {
	it('should convert html_1.html to expected block_1.json', async function () {
		const html = fs.readFileSync('testdata/html_1.html', 'utf8')
		const expected = JSON.parse(fs.readFileSync('testdata/block_1.json', 'utf8'))
		const actual = await html2block(html, {})
		assert.deepStrictEqual(actual, expected)
	})

	it('should convert html_2.html to expected block_2.json', async function () {
		const html = fs.readFileSync('testdata/html_2.html', 'utf8')
		const expected = JSON.parse(fs.readFileSync('testdata/block_2.json', 'utf8'))
		const actual = await html2block(html, {})
		assert.deepStrictEqual(actual, expected)
	})

	it('should convert html_3.html to expected block_3.json', async function () {
		this.timeout(5000)
		const html = fs.readFileSync('testdata/html_3.html', 'utf8')
		const expected = JSON.parse(fs.readFileSync('testdata/block_3.json', 'utf8'))

		const actual = await html2block(html, {})
		assert.deepStrictEqual(actual, expected)
	})

	it('should convert html_4.html to expected block_4.json', async function () {
		this.timeout(5000)
		const html = fs.readFileSync('testdata/html_4.html', 'utf8')
		const expected = JSON.parse(fs.readFileSync('testdata/block_4.json', 'utf8'))

		const actual = await html2block(html, {})
		assert.deepStrictEqual(actual, expected)
	})

	it('should convert html_5.html to expected block_5.json', async function () {
		this.timeout(5000)
		const html = fs.readFileSync('testdata/html_5.html', 'utf8')
		const expected = JSON.parse(fs.readFileSync('testdata/block_5.json', 'utf8'))

		const actual = await html2block(html, {})
		assert.deepStrictEqual(actual, expected)
	})

	it('should convert html_6.html to expected block_6.json', async function () {
		this.timeout(5000)
		const html = fs.readFileSync('testdata/html_6.html', 'utf8')
		const expected = JSON.parse(fs.readFileSync('testdata/block_6.json', 'utf8'))

		const actual = await html2block(html, {})
		assert.deepStrictEqual(actual, expected)
	})
})
