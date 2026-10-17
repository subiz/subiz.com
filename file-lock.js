const path = require('node:path')

// Serialize the entire read/write operation for each destination in this process.
const pending = new Map()

module.exports = async function withFileLock(filename, operation) {
	const key = path.resolve(filename)
	const previous = pending.get(key) || Promise.resolve()
	let release
	const current = new Promise((resolve) => { release = resolve })
	pending.set(key, current)
	await previous
	try {
		return await operation()
	} finally {
		release()
		if (pending.get(key) === current) pending.delete(key)
	}
}
