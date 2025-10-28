# Website

### Fix some docs not shown, just display https://docs.google.com/document/d/1aSXnbxGmRPQQt_cZO6WK-
When exporting from Google Docs, Google Docs does not returns the latest version.

Here is how to fix it

2. Visit each of those links
3. Make some small changes (add space then remove sapce)
4. run `node driveapi.js` again
5. double check to see if there is any outdated-link `ag "title: https:\/\/docs.google"`


How to write a doc with embed video - for agent
1. Insert a 1x1 table
2. Write as pattern "video video-url", example: "video https://www.youtube.com/watch?v=jAkRovJXnDE"
You can view example at https://docs.google.com/document/d/1flHn1GEZmq-vd5Gzbv2uvBVU54WP0W0uKpzNcQX131I/edit?tab=t.0


How to build embed video document to mardown - for Developer
1. Install yt-dlp at https://github.com/yt-dlp/yt-dlp
2. run `node driveapi.js`
