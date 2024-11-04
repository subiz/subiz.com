var html2Block = require('./convert_block.js')
const fs = require('fs')

const rawhtml = fs.readFileSync('./test.html', 'utf8')

async function main() {
	let docM = {}

	let out = await html2Block(rawhtml, docM)
		console.log('OUT', JSON.stringify(out))
}
main()
