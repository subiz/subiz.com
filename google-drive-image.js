const fs = require('fs')
const path = require('path')
const {google} = require('googleapis')
const ytdl = require('ytdl-core')
const {exec} = require('node:child_process')
const FormData = require('form-data')
const axios = require('axios')

const CREDENTIALS_PATH = path.join(process.cwd(), './subiz-version-4-681a4d9d6092.json')
let SCOPES = [
	'https://www.googleapis.com/auth/drive.metadata.readonly',
	'https://www.googleapis.com/auth/drive.file',
	'https://www.googleapis.com/auth/drive.readonly',
]

const CLOUDFLARE_ACCOUNT_ID = 'cc22eff135a40705ebe59955b450217d'
const CLOUDFLARE_API_TOKEN = 'xgrzbPOX3ZvOKGiAVLmW125RGzJ01Le4mzaFexrb'
async function main() {
	uploadToCloudflareStream('./videos/Tăng tốc độ trả lời khách hàng với mẫu tin nhắn [d4Fo9eOcgp4].mp4')
	//downloadYoutubeVideo('https://www.youtube.com/watch?v=Tqj9hjN4Zv8')
}

const ensureDir = (dirPath) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, {recursive: true})
	}
}

main()

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
