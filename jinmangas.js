class JinmangasSource extends ComicSource {
    name = "Jinmangas";
    key = "jinmangas";
    version = "1.0.0";
    minAppVersion = "1.0.0";
    url = "https://raw.githubusercontent.com/Yimilanlan/venera-source/main/jinmangas.js";
    baseUrl = "https://jinmangas.com";

    // ----------------------------------------------------------------------
    // 👇 核心修复区：提供基础模块对象，防止解析器深层检查属性时触发 TypeError
    // ----------------------------------------------------------------------
    explore = [];                             // 探索页面配置
    category = { title: "分类", parts: [] };   // 分类配置
    categoryComics = {};                      // 分类漫画加载
    favorite = {};                            // 收藏功能相关
    account = {};                             // 账户功能相关

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
