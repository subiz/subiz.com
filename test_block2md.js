const assert = require('assert')
const block2md = require('./block2md.js')

describe('block2md', function () {
	it('converts text with bold and italic', function () {
		const block = {
			type: 'text',
			text: 'Xin chao',
			bold: true,
			italic: true,
		}
		// mimics convert.js: <u><b><i>Complex</i></b></u>
		assert.strictEqual(block2md(block).trim(), '<b><i>Xin chao</i></b>')
	})

	it('converts paragraph with multiple text blocks', function () {
		const block = {
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Xin chao ',
				},
				{
					type: 'text',
					text: 'Subiz',
					bold: true,
				},
			],
		}
		assert.strictEqual(block2md(block).trim(), 'Xin chao <b>Subiz</b>')
	})

	it('converts headings', function () {
		const block = {
			type: 'heading',
			level: 2,
			content: [
				{
					type: 'text',
					text: 'Tiêu đề 2',
				},
			],
		}
		// H2 becomes ### and gets {#id}
		assert.strictEqual(block2md(block).trim(), '### Tiêu đề 2 {#tieu-de-2}')
	})

	it('converts bullet list', function () {
		const block = {
			type: 'bullet_list',
			content: [
				{
					type: 'list_item',
					content: [
						{
							type: 'paragraph',
							content: [{type: 'text', text: 'Item 1'}],
						},
					],
				},
				{
					type: 'list_item',
					content: [
						{
							type: 'paragraph',
							content: [{type: 'text', text: 'Item 2'}],
						},
					],
				},
			],
		}
		const expected = `
- Item 1
- Item 2
`
		assert.strictEqual(block2md(block).trim(), expected.trim())
	})

	it('converts ordered list', function () {
		const block = {
			type: 'ordered_list',
			content: [
				{
					type: 'list_item',
					content: [
						{
							type: 'paragraph',
							content: [{type: 'text', text: 'First item'}],
						},
					],
				},
				{
					type: 'list_item',
					content: [
						{
							type: 'paragraph',
							content: [{type: 'text', text: 'Second item'}],
						},
					],
				},
			],
		}
		const expected = `
1. First item
2. Second item
`
		assert.strictEqual(block2md(block).trim(), expected.trim())
	})

	it('converts tables', function () {
		const block = {
			type: 'table',
			content: [
				{
					type: 'table_row',
					content: [
						{
							type: 'table_cell',
							content: [{type: 'text', text: 'Header 1'}],
						},
						{
							type: 'table_cell',
							content: [{type: 'text', text: 'Header 2'}],
						},
					],
				},
				{
					type: 'table_row',
					content: [
						{
							type: 'table_cell',
							content: [{type: 'text', text: 'Cell 1'}],
						},
						{
							type: 'table_cell',
							content: [{type: 'text', text: 'Cell 2'}],
						},
					],
				},
			],
		}
		const expected = `
| Header 1 | Header 2 |
| --- | --- |
| Cell 1 | Cell 2 |
`
		assert.strictEqual(block2md(block).trim(), expected.trim())
	})

	it('converts images and links', function () {
		const imgBlock = {
			type: 'image',
			alt_text: 'An image',
			image: {url: 'https://example.com/img.png'},
		}
		assert.strictEqual(block2md(imgBlock).trim(), '![An image](https://example.com/img.png)')

		const linkBlock = {
			type: 'link',
			href: 'https://example.com',
			text: 'Example',
		}
		assert.strictEqual(block2md(linkBlock).trim(), '[Example](https://example.com)')
	})

	it('converts pre code blocks', function () {
		const block = {
			type: 'pre',
			content: [
				{
					type: 'text',
					text: 'const x = 10;\nconsole.log(x);',
				},
			],
		}
		const expected = '```\nconst x = 10;\nconsole.log(x);\n```'
		assert.strictEqual(block2md(block).trim(), expected)
	})

	it('converts blockquote', function () {
		const block = {
			type: 'blockquote',
			content: [
				{
					type: 'paragraph',
					content: [{type: 'text', text: 'Quote line 1\nQuote line 2'}],
				},
			],
		}
		const expected = '> Quote line 1 Quote line 2'
		assert.strictEqual(block2md(block).trim(), expected)
	})

	it('converts dynamic-field, emoji, and mention', function () {
		assert.strictEqual(block2md({type: 'dynamic-field', text: 'user.name'}).trim(), '{{user.name}}')
		assert.strictEqual(block2md({type: 'emoji', text: 'smile'}).trim(), ':smile:')
		assert.strictEqual(block2md({type: 'mention', attrs: {name: 'Thanh'}}).trim(), '@Thanh')
	})

	it('converts heading with multiple paragraphs', function () {
		const block = {
			type: 'div',
			content: [
				{
					type: 'heading',
					level: 1,
					isTitle: true,
					content: [{type: 'text', text: 'Main Title'}],
				},
				{
					type: 'paragraph',
					content: [{type: 'text', text: 'This is the first paragraph.'}],
				},
				{
					type: 'paragraph',
					content: [{type: 'text', text: 'This is the second (paragraph).'}],
				},
			],
		}
		const expected = '# Main Title\n\nThis is the first paragraph.\n\nThis is the second \\(paragraph\\).'
		assert.strictEqual(block2md(block).trim(), expected)
	})

	it('converts nested paragraphs with explicit newlines 1', function () {
		const block = {
			type: 'paragraph',
			content: [
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: '+ One ',
						},
						{
							type: 'text',
							text: '\n\n',
						},
						{
							type: 'text',
							text: '+ Two',
						},
					],
				},
				{
					type: 'paragraph',
					content: [
						{
							type: 'text',
							text: '+ Three',
						},
					],
				},
			],
		}
		const markdown = block2md(block).trim()
		assert.strictEqual(markdown, '+ One\n\n+ Two\n\n+ Three')
	})

	it('converts nested paragraphs with explicit newlines 2', function () {
		const block = {
			type: 'paragraph',
			content: [
				{
					type: 'text',
					text: 'Kiến thức là tài liệu, văn bản, hình ảnh, … AI sử dụng để trả lời câu hỏi của khách hàng.',
				},
				{
					type: 'text',
					text: '\n\n',
				},
				{
					type: 'text',
					text: '\n\n',
				},
				{
					type: 'text',
					text: 'Bạn nạp kiến thức cho Nhân viên AI như sau:',
				},
			],
		}
		const markdown = block2md(block).trim()
		assert.strictEqual(
			markdown,
			`Kiến thức là tài liệu, văn bản, hình ảnh, … AI sử dụng để trả lời câu hỏi của khách hàng.

Bạn nạp kiến thức cho Nhân viên AI như sau:`,
		)
	})

	it('converts 1x1 table starting with Note: to note block', function () {
		const block = {
			type: 'table',
			content: [
				{
					type: 'table_row',
					content: [
						{
							type: 'table_cell',
							content: [
								{
									type: 'paragraph',
									content: [{type: 'text', text: 'Note: This is a note inside a table'}],
								},
							],
						},
					],
				},
			],
		}
		const expected = `
:::note
This is a note inside a table
:::
`
		assert.strictEqual(block2md(block).trim(), expected.trim())
	})

	it('removes empty headings', function () {
		const block = {
			type: 'heading',
			level: 1,
			content: [],
		}
		assert.strictEqual(block2md(block).trim(), '')

		const blockWithEmptyText = {
			type: 'heading',
			level: 2,
			content: [{type: 'text', text: '  '}],
		}
		assert.strictEqual(block2md(blockWithEmptyText).trim(), '')
	})

	it('newlines in table cell', function () {
		const block = {
			type: 'table',
			content: [
				{
					type: 'table_row',
					content: [
						{
							type: 'table_cell',
							colspan: 1,
							rowspan: 1,
							content: [
								{
									type: 'paragraph',
									content: [{type: 'text', text: 'A'}],
								},
							],
						},
						{
							type: 'table_cell',
							colspan: 1,
							rowspan: 1,
							content: [{type: 'text', text: 'B'}],
						},
					],
				},
				{
					type: 'table_row',
					content: [
						{
							type: 'table_cell',
							colspan: 1,
							rowspan: 1,
							content: [
								{
									type: 'paragraph',
									content: [{type: 'text', text: 'One'}],
								},
								{
									type: 'paragraph',
									content: [{type: 'text', text: 'Two'}],
								},
							],
						},
						{
							type: 'table_cell',
							colspan: 1,
							rowspan: 1,
							content: [
								{
									type: 'paragraph',
									content: [{type: 'text', text: 'Three'}],
								},
							],
						},
					],
				},
			],
		}

		assert.strictEqual(
			block2md(block).trim(),
			`| A | B |
| --- | --- |
| One<br/>Two | Three |`,
		)
	})
})
