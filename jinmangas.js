class JinmangasSource extends ComicSource {
    name = "Jinmangas";
    key = "jinmangas";
    version = "1.0.0";
    minAppVersion = "1.0.0";
    url = "https://raw.githubusercontent.com/Yimilanlan/venera-source/main/jinmangas.js";
    baseUrl = "https://jinmangas.com";

    // ====================================================================
    // 👇 绝对防御区：初始化所有 Venera 可能探查的模块，阻断 undefined 报错
    // ====================================================================
    
    // 1. 必须使用合法的 type（如 multiPageComicList），避免 Unknown type 报错
    explore = [
        {
            title: "首页 (空)",
            type: "multiPageComicList",
            load: async () => { return { comics: [], maxPage: 1 }; }
        }
    ];

    // 2. 将所有潜在的模块声明为空对象，防止抛出 TypeError
    update = {};
    category = {};
    categoryComics = {};
    favorite = {};
    account = {};

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
