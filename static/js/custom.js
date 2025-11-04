if (typeof window !== 'undefined') {
	function scrollToHash() {
		const hash = window.location.hash
		if (hash) {
			const el = document.querySelector(hash)
			if (el) {
				el.scrollIntoView({behavior: 'smooth', block: 'start'})
			}
		}
	}
	// scoll page to
	window.addEventListener('load', () => {
		setTimeout(scrollToHash, 200)
		setTimeout(scrollToHash, 400)
	})
}
