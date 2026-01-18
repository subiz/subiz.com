const fs = require('fs')
const path = require('path')
const {google} = require('googleapis')
const {exec} = require('node:child_process')
const FormData = require('form-data')
const axios = require('axios')
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
		let search = await axios.get(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
			},
			params: {
				search: dlFileName,
			},
		})
		let found = lo.get(search, 'data.result') || []
		if (lo.size(found)) {
			console.log('SEARCH CLOUDFLARE VIDEO HITTTTTTTT', youtubeUrl)
			return found[0]
		}

		// 2️⃣ Dùng yt-dlp để tải video, xuất file mp4 (best quality)
		console.log(`⬇️  Đang tải video từ: ${youtubeUrl}`)
		const {stdout} = await execAsync(
			`cd videos && yt-dlp ${shellEscape(youtubeUrl)} -f "mp4" -o ${shellEscape(dlFileName + '.mp4')}`,
		)

		let filePath = outputDir + '/' + `${dlFileName}.mp4`
		if (!fs.existsSync(filePath)) throw new Error(`Không tìm thấy file sau khi tải: ${filePath}`)

		console.log(`✅ Đã tải video: ${filePath}`)

		// 3️⃣ Upload lên Cloudflare Stream
		const fileName = path.basename(filePath)
		console.log(`🎬 Uploading "${fileName}" lên Cloudflare Stream...`)

		const form = new FormData()
		form.append('file', fs.createReadStream(filePath))

		const res = await axios.post(
			`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/stream`,
			form,
			{
				headers: {
					...form.getHeaders(),
					Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
				},
				maxContentLength: Infinity,
				maxBodyLength: Infinity,
				onUploadProgress: (progressEvent) => {
					if (progressEvent.total) {
						const percent = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2)
						process.stdout.write(`\r⬆️  Upload: ${percent}%`)
					}
				},
			},
		)

		console.log('\n✅ Upload thành công!')
		console.log('📺 Cloudflare video info:', res.data.result)

		// 4️⃣ (Tùy chọn) Xoá file local sau khi upload
		// fs.unlinkSync(filePath)

		return res.data.result
	} catch (err) {
		console.error('\n❌ Lỗi:', err.response?.data || err.message)
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
