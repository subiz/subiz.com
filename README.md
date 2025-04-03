# Website

### Fix some docs not shown, just display https://docs.google.com/document/d/1aSXnbxGmRPQQt_cZO6WK-
When exporting from Google Docs, Google Docs does not returns the latest version.

Here is how to fix it

2. Visit each of those links
3. Make some small changes (add space then remove sapce)
4. run `node driveapi.js` again
5. double check to see if there is any outdated-link `ag "title: https:\/\/docs.google"`
