class JinMangas extends ComicSource {

  name = "JinMangas"

  key = "jinmangas"

  version = "1.0.0"

  minAppVersion = "1.0.0"

  url = "https://jinmangas.com"

  headers = {
    "Referer": "https://jinmangas.com/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  }

  async search(keyword) {

    const res = await Network.get(
      `${this.url}/?s=${encodeURIComponent(keyword)}&post_type=wp-manga`,
      this.headers
    )

    const html = res.body

    const comics = []

    const reg =
      /<a href="(https:\/\/jinmangas\.com\/manga\/.*?)".*?title="(.*?)"/gs

    let match

    while ((match = reg.exec(html)) !== null) {

      comics.push({
        title: match[2],
        url: match[1]
      })

    }

    return comics
  }

}
new JinMangas()
