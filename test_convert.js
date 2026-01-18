var html2md = require('./convert.js')

async function main() {
	//let out = await html2md(
		//`<table style="border-spacing:0;border-collapse:collapse;margin-right:auto"><tr style="height:0pt"><td colspan="1" rowspan="1" style="border-right-style:solid;padding:5pt 5pt 5pt 5pt;border-bottom-color:#000000;border-top-width:1pt;border-right-width:1pt;border-left-color:#000000;vertical-align:top;border-right-color:#000000;border-left-width:1pt;border-top-style:solid;border-left-style:solid;border-bottom-width:1pt;width:468pt;border-top-color:#000000;border-bottom-style:solid"><p style="padding:0;margin:0;color:#000000;font-size:11pt;font-family:&quot;Arial&quot;;line-height:1.0;text-align:left"><span>Video </span><span style="text-decoration-skip-ink:none;-webkit-text-decoration-skip:none;color:#0000ee;text-decoration:underline"><a href="https://www.google.com/url?q=https://drive.google.com/file/d/1MFcewfTCyYx688zQv7OA3p0AlsNt33jU/view&amp;sa=D&amp;source=editors&amp;ust=1766137733041521&amp;usg=AOvVaw0rLqJkDhaEX9ZzLWs0uVJR" style="color:inherit;text-decoration:inherit">Video gi&#7899;i thi&#7879;u AI Subiz h&#7895; tr&#7907; ch&#259;m s&oacute;c b&aacute;n h&agrave;ng.mp4.mp4</a></span></p></td></tr></table>`,
	//)

		let out = await html2md(
				`<table style="border-spacing:0;border-collapse:collapse;margin-right:auto"><tr style="height:0pt"><td colspan="1" rowspan="1" style="border-right-style:solid;padding:5pt 5pt 5pt 5pt;border-bottom-color:#000000;border-top-width:1pt;border-right-width:1pt;border-left-color:#000000;vertical-align:top;border-right-color:#000000;border-left-width:1pt;border-top-style:solid;border-left-style:solid;border-bottom-width:1pt;width:468pt;border-top-color:#000000;border-bottom-style:solid"><p style="padding:0;margin:0;color:#000000;font-size:11pt;font-family:&quot;Arial&quot;;line-height:1.0;text-align:left"><span>note: :::ok <br/><i>iii</i> <b>thanh</b> <ul><li>1</li></ul> </span><span style="text-decoration-skip-ink:none;-webkit-text-decoration-skip:none;color:#0000ee;text-decoration:underline">Mot hai ba</span></p></td></tr></table>`,
		)

	console.log(out)
}
main()
