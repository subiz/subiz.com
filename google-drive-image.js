const fs = require('fs')
const path = require('path')
const {google} = require('googleapis')
const {exec} = require('node:child_process')
const FormData = require('form-data')
const lo = require('lodash')
const util = require('util')
const execAsync = util.promisify(exec)
const crypto = require('crypto')

const CLOUDFLARE_ACCOUNT_ID = 'cc22eff135a40705ebe59955b450217d'
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARESTREAM // 'xgrzbPOX3ZvOKGiAVLmW125RGzJ01Le4mzaFexrb'
function main() {
	//uploadYoutubeToCloudflare('https://www.youtube.com/watch?v=ZgenYNwArb4')
}

//main()

async function uploadYoutubeToCloudflare(youtubeUrl, outputDir = './videos') {
	try {
		// 1️⃣ Tạo thư mục nếu chưa có
		if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, {recursive: true})

		let dlFileName = md5(youtubeUrl)
		console.log('Search Cloudflare for existed video: ', dlFileName)
		let searchRes = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream?search=${dlFileName}`,
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
				},
			},
		)
		let search = await searchRes.json()
		let found = lo.get(search, 'result') || []
		if (lo.size(found)) {
			console.log('SEARCH CLOUDFLARE VIDEO HITTTTTTTT', youtubeUrl)
			return found[0]
		}

		// 2️⃣ Dùng yt-dlp để tải video, xuất file mp4 (best quality)
		console.log(`⬇️  Đang tải video từ: ${youtubeUrl}`)
		const {stdout} = await execAsync(
			`cd videos && yt-dlp --cookies-from-browser chrome ${shellEscape(youtubeUrl)} -f "mp4" -o ${shellEscape(dlFileName + '.mp4')}`,
		)

		let filePath = outputDir + '/' + `${dlFileName}.mp4`
		if (!fs.existsSync(filePath)) throw new Error(`Không tìm thấy file sau khi tải: ${filePath}`)

		console.log(`✅ Đã tải video: ${filePath}`)

		// 3️⃣ Upload lên Cloudflare Stream
		const fileName = path.basename(filePath)
		console.log(`🎬 Uploading "${fileName}" lên Cloudflare Stream...`)

		const form = new FormData()
		form.append('file', fs.createReadStream(filePath))

		const resResponse = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream`, {
			method: 'POST',
			body: form,
			headers: {
				...form.getHeaders(),
				Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
			},
		})

		if (!resResponse.ok) {
			const errorData = await resResponse.text()
			throw new Error(`Upload failed: ${resResponse.statusText} - ${errorData}`)
		}

		const resData = await resResponse.json()

		console.log('\n✅ Upload thành công!')
		console.log('📺 Cloudflare video info:', resData.result)

		// 4️⃣ (Tùy chọn) Xoá file local sau khi upload
		// fs.unlinkSync(filePath)

		return resData.result
	} catch (err) {
		console.error('\n❌ Lỗi:', err.message)
		throw err
	}
}

function md5(content) {
	return crypto.createHash('md5').update(content).digest('hex')
}

module.exports = {
	uploadYoutubeToCloudflare,
}

function shellEscape(str) {
	return `'${str.replace(/'/g, `'\\''`)}'`
}
