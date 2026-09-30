// Preserve ordered results and propagate worker failures to the caller.
module.exports = async function asyncMap(items, callback, limit = 1) {
	const entries = Object.entries(items)
	const results = new Array(entries.length)
	let next = 0
	let failed = false
	async function worker() {
		while (!failed && next < entries.length) {
			const index = next++
			const [key, value] = entries[index]
			try {
				results[index] = await callback(value, key)
			} catch (error) {
				failed = true
				throw error
			}
		}
	}
	await Promise.all(Array.from({length: Math.min(Math.max(1, limit), entries.length)}, worker))
	return results
}
