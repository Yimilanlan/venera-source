const source = {
  id: "jinmangas",
  name: "JinMangas",
  version: "1.0.0",
  baseUrl: "https://jinmangas.com",

  headers: {
    Referer: "https://jinmangas.com/",
    "User-Agent": "Mozilla/5.0"
  },

  async search(keyword) {
    try {
      const url =
        this.baseUrl +
        "/?s=" +
        encodeURIComponent(keyword) +
        "&post_type=wp-manga"

      const res = await Network.get(url)
      const html = res?.body || ""

      const comics = []

      const reg =
        /<a href="(https:\/\/jinmangas\.com\/manga\/[^"]+)".*?title="([^"]+)"/gs

      let match
      while ((match = reg.exec(html)) !== null) {
        comics.push({
          title: match?.[2] || "",
          subTitle: "",
          cover: "",
          url: match?.[1] || ""
        })
      }

      return comics
    } catch (e) {
      return []
    }
  },

  async detail(url) {
    try {
      if (!url) return null

      const res = await Network.get(url)
      const html = res?.body || ""

      return {
        title: "",
        cover: "",
        description: "",
        chapters: []
      }
    } catch (e) {
      return null
    }
  }
}

this.source = source
