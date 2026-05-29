class JinmangasSource extends ComicSource {
    name = "Jinmangas";
    key = "jinmangas";
    version = "1.0.0";
    minAppVersion = "1.0.0";
    // 你的 GitHub 仓库中对应文件的直链（用于 Venera 内的未来更新）
    url = "https://raw.githubusercontent.com/Yimilanlan/venera-source/main/jinmangas.js";
    baseUrl = "https://jinmangas.com";

    // 1. 漫画详情加载
    detail = {
        load: async (id) => {
            // id 为漫画的 slug，如 'wireless-onahole'
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
            
            // 解析包含章节链接的列表
            let chapters = doc.querySelectorAll("li.wp-manga-chapter").map(e => {
                let a = e.querySelector("a");
                return {
                    id: a.attributes["href"], // 技巧：直接将完整的章节 URL 作为 id 传递给下游
                    title: a.text?.trim()
                };
            });
            
            // Venera 一般习惯旧章节在前，可按需 return chapters.reverse();
            return chapters;
        }
    };

    // 3. 漫画图片加载
    image = {
        load: async (chapterId) => {
            // 此时的 chapterId 是上一步传过来的完整 URL
            let res = await Network.get(chapterId);
            let doc = new HtmlDocument(res.body);
            
            // Madara 主题通常把图片放在 .reading-content 容器中
            let images = doc.querySelectorAll(".reading-content img").map(e => {
                return e.attributes["src"] || e.attributes["data-src"]?.trim();
            });
            
            // 过滤空节点，返回纯图片 URL 数组
            return images.filter(url => url != null && url !== "");
        }
    };

    // 4. 搜索功能支持 (可选)
    search = {
        load: async (keyword, options, page) => {
            // WordPress 默认的搜索路径机制
            let res = await Network.get(`${this.baseUrl}/page/${page}/?s=${encodeURIComponent(keyword)}&post_type=wp-manga`);
            let doc = new HtmlDocument(res.body);
            
            let comics = doc.querySelectorAll(".c-tabs-item__content").map(e => {
                let a = e.querySelector("h3 a");
                let img = e.querySelector("img");
                
                // 从网址中截取出纯 ID，如 /manga/wireless-onahole/ -> wireless-onahole
                let href = a.attributes["href"];
                let comicId = href.replace(this.baseUrl + "/manga/", "").replace("/", "");
                
                return {
                    id: comicId,
                    title: a.text?.trim(),
                    cover: img?.attributes["src"] || img?.attributes["data-src"] || ""
                };
            });
            return { comics: comics, maxPage: 99 }; // maxPage 是给 Venera 的翻页标识
        }
    };
}
