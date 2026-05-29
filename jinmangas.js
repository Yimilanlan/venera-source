/* =========================
   VENERA 1.11.x SOURCE TEMPLATE
   Stable / No Invalid Content
   ========================= */

// ===== 基础信息（必须全 String 安全） =====
const source = {
  id: "jinmangas",
  name: "JinMangas",
  version: "1.0.0",
  baseUrl: "https://jinmangas.com",

  headers: {
    Referer: "https://jinmangas.com/",
    "User-Agent": "Mozilla/5.0"
  }
}

// ===== 工具函数（防 null 专用） =====
function safe(v, fallback = "") {
  return v == null ? fallback : v
}

// ===== 搜索 =====
async function search(keyword) {
  try {
    const url =
      source.baseUrl +
      "/?s=" +
      encodeURIComponent(keyword) +
      "&post_type=wp-manga"

    const res = await Network.get(url)
    const html = safe(res && res.body, "")

    const comics = []

    const reg =
      /<a href="(https:\/\/jinmangas\.com\/manga\/[^"]+)".*?title="([^"]+)"/gs

    let match

    while ((match = reg.exec(html)) !== null) {
      comics.push({
        title: safe(match[2]),
        subTitle: "",
        cover: "",
        url: safe(match[1])
      })
    }

    return comics
  } catch (e) {
    return []
  }
}

// ===== 详情页 =====
async function detail(url) {
  try {
    if (!url) return null

    const res = await Network.get(url)
    const html = safe(res && res.body, "")

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

// ===== 必须导出（关键！Venera识别点） =====
this.source = source
this.search = search
this.detail = detail
