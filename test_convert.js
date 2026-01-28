var html2md = require('./convert.js')
var fs = require('fs')

async function main() {
	//let data = fs.readFileSync('./raw/1-QVWpOjtuVSAQRteKVXlpkfqskGsrmZ4yFb196Fdn3A.html')
	//let html = data.toString()
	/*
	let out = await html2md(
		html,
		{
			'1jCYIsarPIgVlc43DW_TKXcBbFCok1-PgkJgG0t0dJfo': {
				mimeType: 'application/vnd.google-apps.document',
				parents: ['1LllTe8n9sn9h-g92mFoeLVUa9SCcmROf'],
				id: '1jCYIsarPIgVlc43DW_TKXcBbFCok1-PgkJgG0t0dJfo',
				name: '5. Nhắc việc',
				modifiedTime: '2026-01-15T09:41:28.637Z',
				version: '168',
				path_lower: '/30 Tư vấn khách hàng/5-nhac-viec',
			},
		},
		{},
	)
	console.log('OUT', out)
	*/
	let out3 = await html2md(
	`<table style="border-spacing:0;border-collapse:collapse;margin-right:auto"><tr style="height:0pt"><td colspan="1" rowspan="1" style="border-right-style:solid;padding:5pt 5pt 5pt 5pt;border-bottom-color:#000000;border-top-width:1pt;border-right-width:1pt;border-left-color:#000000;vertical-align:top;border-right-color:#000000;border-left-width:1pt;border-top-style:solid;border-left-style:solid;border-bottom-width:1pt;width:468pt;border-top-color:#000000;border-bottom-style:solid"><p style="padding:0;margin:0;color:#000000;font-size:11pt;font-family:&quot;Arial&quot;;line-height:1.0;text-align:left"><span>Video </span><span style="text-decoration-skip-ink:none;-webkit-text-decoration-skip:none;color:#0000ee;text-decoration:underline"><a href="https://www.google.com/url?q=https://drive.google.com/file/d/1MFcewfTCyYx688zQv7OA3p0AlsNt33jU/view&amp;sa=D&amp;source=editors&amp;ust=1766137733041521&amp;usg=AOvVaw0rLqJkDhaEX9ZzLWs0uVJR" style="color:inherit;text-decoration:inherit">Video gi&#7899;i thi&#7879;u AI Subiz h&#7895; tr&#7907; ch&#259;m s&oacute;c b&aacute;n h&agrave;ng.mp4.mp4</a></span></p></td></tr></table>`,
		)

		console.log(out3)

	let out = await html2md(
		`<table style="border-spacing:0;border-collapse:collapse;margin-right:auto"><tr style="height:0pt"><td colspan="1" rowspan="1" style="border-right-style:solid;padding:5pt 5pt 5pt 5pt;border-bottom-color:#000000;border-top-width:1pt;border-right-width:1pt;border-left-color:#000000;vertical-align:top;border-right-color:#000000;border-left-width:1pt;border-top-style:solid;border-left-style:solid;border-bottom-width:1pt;width:468pt;border-top-color:#000000;border-bottom-style:solid"><p style="padding:0;margin:0;color:#000000;font-size:11pt;font-family:&quot;Arial&quot;;line-height:1.0;text-align:left"><span>note: :::ok <br/><i>iii</i> <b>thanh</b> <ul><li>1</li></ul> </span><span style="text-decoration-skip-ink:none;-webkit-text-decoration-skip:none;color:#0000ee;text-decoration:underline">Mot hai ba</span></p></td></tr></table>`,
	)
	console.log(out)

	let out2 = await html2md(`<table style="border-spacing: 0; border-collapse: collapse; margin-right: auto">
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
						<span>tip:<br />File t&#7843;i v&#7873; s&#7869; l&agrave; &#273;&#7883;nh d&#7841;ng </span
						><span style="background-color: #ffffff; color: #ffffff">.</span
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
							>, h&atilde;y t&#7843;i l&ecirc;n Google Drive, m&#7903; b&#7857;ng Google Trang t&iacute;nh (Google
							Sheets) ho&#7863;c s&#7917; d&#7909;ng excel &#273;&#7875; import file l&agrave;
							&#273;&#432;&#7907;c.</span
						>
					</p>
				</td>
			</tr>
		</table>`)

	console.log(out2)
}
main()
