import React from 'react'

export default function EmbedVideo({src, resolution = {}}) {
	const MIN_HW_RATIO = 0.5 // for common video on youtube with resolution 1920x1080
	const MAX_HW_RATIO = 2.2 // for common video on short with resolution 864x1920

	let ratio = MIN_HW_RATIO
	if (
		resolution.width &&
		resolution.height &&
		typeof resolution.width === 'number' &&
		typeof resolution.height === 'number'
	) {
		ratio = resolution.height / resolution.width
		if (ratio > MAX_HW_RATIO) ratio = MAX_HW_RATIO
		if (ratio < MIN_HW_RATIO) ratio = MIN_HW_RATIO
	}
	return (
		<div style={{position: 'relative', width: '100%', paddingTop: displayPercentage(ratio) /*16 : 9*/}}>
			<iframe
				src={src}
				style={{border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%'}}
				allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen'
				allowFullScreen></iframe>
		</div>
	)
}

function displayPercentage(ratio) {
	return Math.round(ratio * 10_000) / 100 + '%'
}
