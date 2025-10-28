import React from 'react'

export default function EmbedVideo({src}) {
	return (
		<iframe
			src={src}
			style={{border: 'none'}}
			height='360'
			width='640'
			allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
			allowfullscreen></iframe>
	)
}
