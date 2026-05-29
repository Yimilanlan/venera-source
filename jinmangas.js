class JinmangasSource extends ComicSource {
    name = "Jinmangas";
    key = "jinmangas";
    version = "1.0.0";
    minAppVersion = "1.0.0";
    url = "https://raw.githubusercontent.com/Yimilanlan/venera-source/main/jinmangas.js";
    baseUrl = "https://jinmangas.com";

    // ====================================================================
    // 👇 究极防御区：占位 Venera 所有隐藏支持的高级模块，彻底阻断崩溃
    // ====================================================================
    category = {};
    categoryComics = {};
    favorite = {};
    account = {};
    update = {};
    // 新增的隐藏探查模块
    comments = {};
    tags = {};
    tagComics = {};
    author = {};
    authorComics = {};
    related = {};
    relatedComics = {};
    rank = {};
    ranking = {};

    // ====================================================================
    // 👇 核心业务逻辑区
    // ====================================================================

    // 1. 漫画详情加载
    detail = {
        load: async (id) => {
            let res = await Network.get(`${this.baseUrl}/manga/${id}/`);
            let doc = new HtmlDocument(res.body);
            
            let title = doc.querySelector(".post-title h1")?.text?.trim() || "未知标题";
            let coverImg = doc.querySelector(".summary_image img");
            let cover = coverImg?.attributes["src"] || coverImg?.attributes["data-src"] || "";
            let desc = doc.querySelector(".summary__content")?.text?.trim() || "";
            
            return {
                title: title,
                cover: cover,
                description: desc,
            };
        }
    };

    // 2. 章节列表加载
    chapter = {
        load: async (id) => {
            let res = await Network.get(`${this.baseUrl}/manga/${id}/`);
            let doc = new HtmlDocument(res.body);
            
            let chapters = doc.querySelectorAll("li.wp-manga-chapter").map(e => {
                let a = e.querySelector("a");
                return {
                    id: a.attributes["href"],
                    title: a.text?.trim()
                };
            });
            
            return chapters;
        }
    };

    // 3. 漫画图片加载
    image = {
        load: async (chapterId) => {
            let res = await Network.get(chapterId);
            let doc = new HtmlDocument(res.body);
            
            let images = doc.querySelectorAll(".reading-content img").map(e => {
                return e.attributes["src"] || e.attributes["data-src"]?.trim();
            });
            
            return images.filter(url => url != null && url !== "");
        }
    };

    // 4. 搜索功能支持
    search = {
        load: async (keyword, options, page) => {
            let res = await Network.get(`${this.baseUrl}/page/${page}/?s=${encodeURIComponent(keyword)}&post_type=wp-manga`);
            let doc = new HtmlDocument(res.body);
            
            let comics = doc.querySelectorAll(".c-tabs-item__content").map(e => {
                let a = e.querySelector("h3 a");
                let img = e.querySelector("img");
                
                let href = a.attributes["href"];
                let comicId = href.replace(this.baseUrl + "/manga/", "").replace("/", "");
                
                return {
                    id: comicId,
                    title: a.text?.trim(),
                    cover: img?.attributes["src"] || img?.attributes["data-src"] || ""
                };
            });
            return { comics: comics, maxPage: 99 };
        }
    };
}
