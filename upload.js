var request = require('request')

const testFolder = './block/'
const fs = require('fs')

fs.readdir(testFolder, (err, files) => {
	files.forEach(async (file) => {
		if (file == 'index') return
		let data = fs.readFileSync(testFolder + file, {encoding: 'utf8'})
		request(
			{
				url: 'https://api.subiz.com.vn/4.0/accounts/acpxkgumifuoofoosble/articles/-?x-access-token=v6ag.agqmwfyuehpuzpehmv.rtsculxhwybbourvndvichennnvtarrfzhutorcldymuh&account-id=acpxkgumifuoofoosble',
				method: 'POST',
				body: data,
			},
			function (error, response, body) {
				let out = JSON.parse(body)
				if (out && out.article && out.article.id) return
				console.log(file, body, error)
			},
		)
	})
})
