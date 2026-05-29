export default {
  name: "JinMangas",
  key: "jinmangas",
  version: "1.0.0",
  minAppVersion: "1.11.0",
  url: "https://jinmangas.com",

  headers: {
    "Referer": "https://jinmangas.com/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  },

  async search(keyword) {

    const res = await Network.get(
      `https://jinmangas.com/?s=${encodeURIComponent(keyword)}&post_type=wp-manga`
    )

    const html = res.body

    const comics = []

    const reg =
      /<a href="(https:\/\/jinmangas\.com\/manga\/.*?)".*?title="(.*?)"/gs

    let match

    while ((match = reg.exec(html)) !== null) {

      comics.push({
        title: match[2],
        subTitle: "",
        cover: "",
        url: match[1]
      })

    }

    return comics
  }
}
