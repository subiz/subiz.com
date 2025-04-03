var html2md = require('./convert.js')


async function main() {
		let out = await html2md(`<span style="color:#000000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:14pt;font-family:&quot;Times New Roman&quot;;font-style:normal">&nbsp;– Tham số được sử dụng trong tin nhắn (ví dụ: &lt;customer_name&gt;, &lt;order_id&gt;).</span>`)
		console.log(out)
}
main()
