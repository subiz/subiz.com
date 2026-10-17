const {createHash} = require('node:crypto')
const endpoint = 'https://api.subiz.com.vn/4.0/accounts/acpxkgumifuoofoosble/files/url/download'

module.exports = async function uploadImageToSubiz(source) {
	const controller = new AbortController()
	const timeout = setTimeout(() => controller.abort(), 60_000)
	const label = source.startsWith('data:') ? source.split(',')[0] + ',[omitted]' : source.slice(0, 160)
	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({account_id: 'acpxkgumifuoofoosble', url: source}),
			signal: controller.signal,
		})
		if (!response.ok) {
			let responseBody
			try {
				responseBody = (await response.text())
					.split(source).join(label)
					.replace(/data:[^,\s"<>]*,[^\s"<>\\]*/gi, '[data URI omitted]')
					.slice(0, 4000)
			} catch (error) {
				responseBody = `[Unable to read response body: ${error.message}]`
			}
			console.error('[image-upload] Request failed', {
				status: response.status,
				statusText: response.statusText,
				source: label,
				sourceLength: source.length,
				sourceSha256: createHash('sha256').update(source).digest('hex'),
				responseBody,
			})
			throw new Error(`HTTP ${response.status}`)
		}
		const result = await response.json()
		const url = new URL(result.url)
		if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Upload returned an invalid image URL')
		return url.href
	} catch (error) {
		throw new Error(`Image upload failed (${label}): ${error.message}`, {cause: error})
	} finally {
		clearTimeout(timeout)
	}
}
