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
		if (!response.ok) throw new Error(`HTTP ${response.status}`)
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
