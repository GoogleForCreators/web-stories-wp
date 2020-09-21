module.exports = {
  permalink: data => {
    let fileName = `${data.page.filePathStem.replace(new RegExp(`^/${data.metadata.defaultLocale}/`),'/')}`

    return fileName.includes('.') ? fileName : `${fileName}.html`;
  }
}
