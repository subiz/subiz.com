const test = require('tape')
const {cleanMarkdown} = require('./util.js')

test('cleanMarkdown: removes multiple H1 titles, keeping only the last one', (t) => {
	const input = `# title 1
# title 2
Some text here.
---
More text.`

	const expected = `# title 2
Some text here.
---
More text.`

	t.equal(cleanMarkdown(input), expected, 'should keep only the last H1 title')
	t.end()
})

test('cleanMarkdown: does nothing if there is only one H1 title', (t) => {
	const input = `# title 1
Some text here.`

	const expected = `# title 1
Some text here.`

	t.equal(cleanMarkdown(input), expected, 'should preserve the single H1 title')
	t.end()
})

test('cleanMarkdown: handles markdown with no H1 titles', (t) => {
	const input = `## subtitle
Some text here.`

	const expected = `## subtitle
Some text here.`

	t.equal(cleanMarkdown(input), expected, 'should preserve content with no H1 titles')
	t.end()
})

test('cleanMarkdown: handles empty input', (t) => {
	t.equal(cleanMarkdown(''), '', 'should handle empty string')
	t.equal(cleanMarkdown(null), '', 'should handle null')
	t.end()
})

test('cleanMarkdown: realcase', (t) => {
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

	t.equal(cleanMarkdown(input), expected, 'should preserve the single H1 title')
	t.end()
})
