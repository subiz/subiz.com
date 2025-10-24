import React from 'react'

export default function EmbedVideo({src}) {
	return (
		<div className='embed-video-wrapper'>
			<video controls style={{minHeight: '240px', maxWidth: '100%'}}>
				<source src={src} />
			</video>
		</div>
	)
}
