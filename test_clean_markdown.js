const assert = require('assert')
const {cleanMarkdown} = require('./util.js')

describe('cleanMarkdown', function () {
	it('removes multiple H1 titles, keeping only the last one', function () {
		const input = `# title 1
# title 2
Some text here.
---
More text.`

		const expected = `# title 2
Some text here.
---
More text.`

		assert.strictEqual(cleanMarkdown(input), expected)
	})

	it('does nothing if there is only one H1 title', function () {
		const input = `# title 1
Some text here.`

		const expected = `# title 1
Some text here.`

		assert.strictEqual(cleanMarkdown(input), expected)
	})

	it('handles markdown with no H1 titles', function () {
		const input = `## subtitle
Some text here.`

		const expected = `## subtitle
Some text here.`

		assert.strictEqual(cleanMarkdown(input), expected)
	})

	it('handles empty input', function () {
		assert.strictEqual(cleanMarkdown(''), '')
		assert.strictEqual(cleanMarkdown(null), '')
	})

	it('realcase', function () {
		const input = `import EmbedVideo from '@site/src/components/EmbedVideo.js';

# 10. Chatbot kịch bản sẵn

# Chatbot kịch bản sẵn

## Tiện ích {#tien-ich}


<b>[Subiz Chatbot](https://subiz.com.vn/chatbot/)</b> là công cụ chatbot <b>chạy theo kịch bản có sẵn, tự động nhắn tin trả lời khách</b> hàng từ website, Fanpage, Zalo OA, Instagram.
`

		const expected = `import EmbedVideo from '@site/src/components/EmbedVideo.js';


# Chatbot kịch bản sẵn

## Tiện ích {#tien-ich}


<b>[Subiz Chatbot](https://subiz.com.vn/chatbot/)</b> là công cụ chatbot <b>chạy theo kịch bản có sẵn, tự động nhắn tin trả lời khách</b> hàng từ website, Fanpage, Zalo OA, Instagram.
`

		assert.strictEqual(cleanMarkdown(input), expected)
	})
})
