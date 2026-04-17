const assert = require('assert')
const html2block2md = require('./html2block2md.js')

describe('html2block2md', function () {
	this.timeout(10000)

	it('converts simple HTML to markdown via blocks', async function () {
		// <h1> is shifted to ## and gets {#id}
		const html = '<h1>Title</h1><p>Hello world!</p>'
		const markdown = await html2block2md(html)
		assert.strictEqual(markdown.trim(), '## Title {#title}\n\nHello world\\!')
	})

	it('converts notes in tables to :::note syntax', async function () {
		const html = `
      <table>
        <tr>
          <td>
            <p>Tip: This is a tip.</p>
            <p>Second line.</p>
          </td>
        </tr>
      </table>
    `
		const markdown = await html2block2md(html)
		const expected = `
:::tip
This is a tip.

Second line.
:::
`
		assert.strictEqual(markdown.trim(), expected.trim())
	})

	it('converts images in headings by moving them above', async function () {
		const html = '<h1><img src="https://example.com/logo.png" alt="Logo">Title</h1>'
		const markdown = await html2block2md(html)
		// <h1> becomes ## and gets {#title}
		// image will have subiz url if upload succeeds, for test we check the structure
		assert.ok(markdown.includes('![Logo]('))
		assert.ok(markdown.includes('## Title {#title}'))
	})

	it('converts complex formatting (bold, italic, underline)', async function () {
		const html = '<p><span style="font-weight: 500; font-style: italic; text-decoration: underline">Complex</span></p>'
		const markdown = await html2block2md(html)
		// mimics convert.js: <u><b><i>Complex</i></b></u>
		assert.strictEqual(markdown.trim(), '<u><b><i>Complex</i></b></u>')
	})

	it('adds EmbedVideo import when video is present', async function () {
		const html = '<embedvideo src="https://example.com/video.mp4" data-source-url="https://youtube.com/v123"></embedvideo>'
		const markdown = await html2block2md(html)
		assert.ok(markdown.includes("import EmbedVideo from '@site/src/components/EmbedVideo.js';"))
		assert.ok(markdown.includes('<EmbedVideo src="https://example.com/video.mp4"'))
	})

	it('escapes special characters like >, <, and | using normalize', async function () {
		const html = '<p>Greater than > Less than < Pipe |</p>'
		const markdown = await html2block2md(html)
		assert.strictEqual(markdown.trim(), 'Greater than &gt; Less than &lt; Pipe \\|')
	})

	it('escapes # character using normalize', async function () {
		const html = '<p>This is a #hash</p>'
		const markdown = await html2block2md(html)
		assert.strictEqual(markdown.trim(), 'This is a \\#hash')
	})

	it('preserves spaces around inline elements (bold, links)', async function () {
		const html = '<p>Bạn có <b>14 ngày dùng thử Subiz</b> trải nghiệm tất cả tính năng hoàn toàn miễn phí. Bạn đăng ký dùng thử qua link <a href="https://app.subiz.com.vn/register">https://app.subiz.com.vn/register</a>.</p>'
		const markdown = await html2block2md(html)
		const expected = 'Bạn có <b>14 ngày dùng thử Subiz</b> trải nghiệm tất cả tính năng hoàn toàn miễn phí. Bạn đăng ký dùng thử qua link [https://app.subiz.com.vn/register](https://app.subiz.com.vn/register).'
		assert.strictEqual(markdown.trim(), expected)
	})

	it('does not escape characters inside code blocks (pre)', async function () {
		const html = '<pre><code>&lt;script&gt;alert("hello");&lt;/script&gt;</code></pre>'
		const markdown = await html2block2md(html)
		assert.ok(markdown.includes('```\n<script>alert("hello");</script>\n```'))
	})
})
