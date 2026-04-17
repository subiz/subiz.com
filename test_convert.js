const assert = require('assert')
const html2md = require('./convert.js')

describe('html2md', function () {
	this.timeout(10000)

	it('should convert table with video link to EmbedVideo component', async function () {
		const input = `<table style="border-spacing:0;border-collapse:collapse;margin-right:auto"><tr style="height:0pt"><td colspan="1" rowspan="1" style="border-right-style:solid;padding:5pt 5pt 5pt 5pt;border-bottom-color:#000000;border-top-width:1pt;border-right-width:1pt;border-left-color:#000000;vertical-align:top;border-right-color:#000000;border-left-width:1pt;border-top-style:solid;border-left-style:solid;border-bottom-width:1pt;width:468pt;border-top-color:#000000;border-bottom-style:solid"><p style="padding:0;margin:0;color:#000000;font-size:11pt;font-family:&quot;Arial&quot;;line-height:1.0;text-align:left"><span>Video </span><span style="text-decoration-skip-ink:none;-webkit-text-decoration-skip:none;color:#0000ee;text-decoration:underline"><a href="https://www.google.com/url?q=https://drive.google.com/file/d/1MFcewfTCyYx688zQv7OA3p0AlsNt33jU/view&amp;sa=D&amp;source=editors&amp;ust=1766137733041521&amp;usg=AOvVaw0rLqJkDhaEX9ZzLWs0uVJR" style="color:inherit;text-decoration:inherit">Video giới thiệu AI Subiz hỗ trợ chăm sóc bán hàng.mp4.mp4</a></span></p></td></tr></table>`
		const actual = await html2md(input)
		assert.ok(actual.includes("import EmbedVideo from '@site/src/components/EmbedVideo.js';"))
		assert.ok(actual.includes('<EmbedVideo src="https://customer-8058rd30y1ksv9tw.cloudflarestream.com/592b1274f3488effdc9de2bd407c64f3/watch"'))
	})

	it('should convert table with "note:" to :::note block', async function () {
		const input = `<table style="border-spacing:0;border-collapse:collapse;margin-right:auto"><tr style="height:0pt"><td colspan="1" rowspan="1" style="border-right-style:solid;padding:5pt 5pt 5pt 5pt;border-bottom-color:#000000;border-top-width:1pt;border-right-width:1pt;border-left-color:#000000;vertical-align:top;border-right-color:#000000;border-left-width:1pt;border-top-style:solid;border-left-style:solid;border-bottom-width:1pt;width:468pt;border-top-color:#000000;border-bottom-style:solid"><p style="padding:0;margin:0;color:#000000;font-size:11pt;font-family:&quot;Arial&quot;;line-height:1.0;text-align:left"><span>note: :::ok <br/><i>iii</i> <b>thanh</b> <ul><li>1</li></ul> </span><span style="text-decoration-skip-ink:none;-webkit-text-decoration-skip:none;color:#0000ee;text-decoration:underline">Mot hai ba</span></p></td></tr></table>`
		const actual = await html2md(input)
		const expected = `:::note
&#58;&#58;&#58;ok 

<i>iii</i> <b>thanh</b>
:::`
		assert.strictEqual(actual.trim(), expected.trim())
	})

	it('should convert table with "tip:" to :::tip block', async function () {
		const input = `<table style="border-spacing: 0; border-collapse: collapse; margin-right: auto">
			<tr style="height: 0pt">
				<td
					colspan="1"
					rowspan="1"
					style="
						border-right-style: solid;
						padding: 5pt 5pt 5pt 5pt;
						border-bottom-color: #000000;
						border-top-width: 1pt;
						border-right-width: 1pt;
						border-left-color: #000000;
						vertical-align: top;
						border-right-color: #000000;
						border-left-width: 1pt;
						border-top-style: solid;
						border-left-style: solid;
						border-bottom-width: 1pt;
						width: 451.4pt;
						border-top-color: #000000;
						border-bottom-style: solid;
					"
				>
					<p
						style="
							padding: 0;
							margin: 0;
							color: #000000;
							font-size: 11pt;
							font-family: 'Arial';
							line-height: 1.15;
							orphans: 2;
							widows: 2;
							text-align: left;
						"
					>
						<span>tip:<br />File tải về sẽ là định dạng </span><span style="background-color: #ffffff; color: #ffffff">.</span
						><span style="background-color: #000000; color: #ffffff">csv</span
						><span
							style="
								color: #000000;
								font-weight: 400;
								text-decoration: none;
								vertical-align: baseline;
								font-size: 11pt;
								font-family: 'Arial';
								font-style: normal;
							"
							>, hãy tải lên Google Drive, mở bằng Google Trang tính (Google
							Sheets) hoặc sử dụng excel để import file là được.</span
						>
					</p>
				</td>
			</tr>
		</table>`
		const actual = await html2md(input)
		const expected = `:::tip
File tải về sẽ là định dạng .\`csv\`, hãy tải lên Google Drive, mở bằng Google Trang tính \\(Google Sheets\\) hoặc sử dụng excel để import file là được.
:::`
		assert.strictEqual(actual.trim(), expected.trim())
	})
})
