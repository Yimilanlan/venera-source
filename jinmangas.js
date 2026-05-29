export default {
  name: "JinMangas",
  key: "jinmangas",
  version: "1.0.0",
  minAppVersion: "1.11.0",
  url: "https://jinmangas.com",

  headers: {
    Referer: "https://jinmangas.com/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  },

  async search(keyword) {
    const res = await Network.get(
      `https://jinmangas.com/?s=${encodeURIComponent(keyword)}&post_type=wp-manga`
    )

    const html = res.body || ""

    const comics = []

    const reg =
      /<a href="(https:\/\/jinmangas\.com\/manga\/[^"]+)".*?title="([^"]+)"/gs

    let match

    while ((match = reg.exec(html)) !== null) {
      comics.push({
        // 🔥 关键：全部强制 string，防 null crash
        title: match[2] || "",
        subTitle: "",
        cover: "",
        url: match[1] || ""
      })
    }

    return comics
  },

  // 🔥 1.11.1 推荐加：detail 防止后续页面炸
  async detail(url) {
    if (!url) return null

    const res = await Network.get(url)
    const html = res.body || ""

    return {
      title: "",
      cover: "",
      description: "",
      chapters: []
    }
  }
}
