import React from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'

export default function EmbedVideo({src, resolution = {}}) {
	return (
		<BrowserOnly>
			{() => {
				const MIN_HW_RATIO = 0.5 // for common video on youtube with resolution 1920x1080
				let MAX_HW_RATIO = 1.5 // for common video on short with resolution 864x1920
				if (window.innerWidth < 600) MAX_HW_RATIO = 2.22 // in mobile screen, allow short video can be more sketchable

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
					<div data-component="embed-video" style={{position: 'relative', width: '100%', paddingTop: displayPercentage(ratio)}}>
						<iframe
							src={src}
							style={{border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%'}}
							allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen'
							allowFullScreen></iframe>
					</div>
				)
			}}
		</BrowserOnly>
	)
}

function displayPercentage(ratio) {
	return Math.round(ratio * 10_000) / 100 + '%'
}
