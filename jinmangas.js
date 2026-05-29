class JinmangasSource extends ComicSource {
    name = "Jinmangas";
    key = "jinmangas";
    version = "1.0.0";
    minAppVersion = "1.0.0";
    url = "https://raw.githubusercontent.com/Yimilanlan/venera-source/main/jinmangas.js";
    baseUrl = "https://jinmangas.com";

    // ----------------------------------------------------------------------
    // 👇 终极防崩溃区：提供结构完整的空模块，满足 Dart 端所有深层探查
    // ----------------------------------------------------------------------
    explore = [
        {
            title: "主页 (空)",
            type: "single",
            load: async () => { return []; },
            loadThumbnails: async () => { return []; } // 阻止 explore[0].loadThumbnails 报错
        }
    ];                             
    category = { title: "分类", parts: [] };   
    categoryComics = {
        load: async () => { return []; },
        loadThumbnails: async () => { return []; }     // 阻止 categoryComics.loadThumbnails 报错
    };                      
    favorite = {
        multiFolder: false,
        add: async () => {},
        delete: async () => {}
    };                            
    account = {
        login: async () => {},
        logout: () => {}
    };

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
        },
        loadThumbnails: async () => { return []; } // 阻止 search.loadThumbnails 报错
    };
}
