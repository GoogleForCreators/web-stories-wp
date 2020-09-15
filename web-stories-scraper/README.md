# Web Stories Scraper

Downloads web stories to a given directory.

## Usage

`stories.txt` contains the list of story URLs to be downloaded.

You can add new URLs to that file, separated by newline.

Then, execute the script and provide the target directory. Example:

```bash
$ node index.js ../public/stories
Downloading 1 story and saving to '../public/stories'
Downloaded https://example.com/story to ../public/stories/example.com/story/index.html
```
