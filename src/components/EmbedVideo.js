import React from 'react'

export default function EmbedVideo({src}) {
	return (
		<div style={{position: 'relative', width: '100%', paddingTop: '50%' /*16 : 9*/}}>
			<iframe
				src={src}
				style={{border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%'}}
				allow='accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;'
				allowfullscreen></iframe>
		</div>
	)
}
