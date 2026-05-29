export 默认 {
  id: "jinmangas",
  name: "JinMangas",
  version: "1.0.0",
  baseUrl: "https://jinmangas.com",

  headers: {
    Referer: "https://jinmangas.com/",
    "User-Agent": "Mozilla/5.0"
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
        title: match[2] || "",
        subTitle: "",
        cover: "",
        url: match[1] || ""
      })
    }

    return comics
  },

  async detail(url) {
    if (!url) return { title: "", cover: "", description: "", chapters: [] }

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
