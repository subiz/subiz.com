const assert = require('node:assert/strict')
const {test} = require('node:test')
const withFileLock = require('./file-lock.js')

test('same destination waits for conversion and writes; other destinations can run', async () => {
	let releaseFirst
	const gate = new Promise((resolve) => { releaseFirst = resolve })
	const events = []
	const first = withFileLock('./data/lock-test.html', async () => {
		events.push('first-start')
		await gate
		events.push('first-done')
	})
	const second = withFileLock('./data/../data/lock-test.html', async () => {
		events.push('second')
	})
	await withFileLock('./data/other-test.html', async () => {
		events.push('other')
	})
	assert.deepEqual(events, ['first-start', 'other'])
	releaseFirst()
	await Promise.all([first, second])
	assert.deepEqual(events, ['first-start', 'other', 'first-done', 'second'])
})

test('failed operations release their lock for queued and subsequent operations', async () => {
	const first = withFileLock('./data/failed-test.html', async () => { throw new Error('export failed') })
	const next = withFileLock('./data/failed-test.html', async () => 'next')
	await assert.rejects(first, /export failed/)
	assert.equal(await next, 'next')
	assert.equal(await withFileLock('./data/failed-test.html', async () => 'later'), 'later')
})
