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

const CREDENTIALS_PATH = path.join(process.cwd(), './subiz-version-4-681a4d9d6092.json')
let SCOPES = [
	'https://www.googleapis.com/auth/drive.metadata.readonly',
	'https://www.googleapis.com/auth/drive.file',
	'https://www.googleapis.com/auth/drive.readonly',
]

const CLOUDFLARE_ACCOUNT_ID = 'cc22eff135a40705ebe59955b450217d'
const CLOUDFLARE_API_TOKEN = 'xgrzbPOX3ZvOKGiAVLmW125RGzJ01Le4mzaFexrb'
async function main() {
	//removeAllFilesInDirectory('./videos')
	//uploadYoutubeToCloudflare('https://www.youtube.com/watch?v=jAkRovJXnDE')
}

const ensureDir = (dirPath) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, {recursive: true})
	}
}

//main()

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
	const auth = new google.auth.GoogleAuth({
		keyFile: CREDENTIALS_PATH,
		scopes: SCOPES,
	})
	return auth.getClient()
}

async function uploadToCloudflareStream(filePath) {
	try {
		if (!fs.existsSync(filePath)) throw new Error(`Không tìm thấy file: ${filePath}`)

		const fileName = filePath.split('/').pop()
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
					const percent = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2)
					process.stdout.write(`\r⬆️  Đang upload: ${percent}%`)
				},
			},
		)

		console.log('\n✅ Upload thành công!')
		console.log('📺 Video info:', res.data.result)

		return res.data.result
	} catch (err) {
		console.error('\n❌ Lỗi upload:', err.response?.data || err.message)
	}
}

async function downloadYoutubeVideo(youtubeUrl, outputDir = './videos') {
	exec(`cd videos && yt-dlp ${youtubeUrl}`, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`)
			return
		}
		console.log(`stdout: ${stdout}`)
		console.error(`stderr: ${stderr}`)
	})
}

async function uploadYoutubeToCloudflare(youtubeUrl, outputDir = './videos') {
	try {
		// 1️⃣ Tạo thư mục nếu chưa có
		if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, {recursive: true})

		console.log(`⬇️  Đang tải video từ YouTube: ${youtubeUrl}`)

		// 2️⃣ Dùng yt-dlp để tải video, xuất file mp4 (best quality)
		// --print filename: in ra tên file đã tải
		let dlFileName = md5(youtubeUrl)
		const {stdout} = await execAsync(`cd videos && yt-dlp ${youtubeUrl} -f "mp4" -o "${dlFileName}.%(ext)s"`)

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

function getYoutubeId(url) {
	try {
		const parsed = new URL(url)
		if (parsed.hostname !== 'www.youtube.com' && parsed.hostname !== 'youtube.com') {
			return null
		}

		// Lấy giá trị query param "v"
		return parsed.searchParams.get('v')
	} catch {
		return null
	}
}

function md5(content) {
	return crypto.createHash('md5').update(content).digest('hex')
}

module.exports = {
	downloadYoutubeVideo,
	uploadToCloudflareStream,
	uploadYoutubeToCloudflare,
}
