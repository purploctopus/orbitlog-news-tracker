//    const apiUrl = "https://api.spaceflightnewsapi.net/v4/articles/?limit=10";
// fetch_news.js - Paginated Spaceflight News API Ingestion Engine
const fs = require('fs');

async function fetchPaginatedSpaceNews() {
  try {
    console.log("🌐 Connecting to Spaceflight News API v4...");
    
    // 💡 THE CHANGE: Fetch the top 50 articles all at once to prepare multiple pages
    const apiUrl = "https://api.spaceflightnewsapi.net/v4/articles/?limit=100";
    
    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "OrbitLogiOSApp/1.0.3 (GitHub-Action-Agent)" }
    });

    if (!response.ok) throw new Error(`HTTP network error: ${response.status}`);
    const data = await response.json();

    const streamlinedNews = data.results.map(article => ({
      id: article.id,
      title: article.title.trim(),
      summary: article.summary.trim(),
      imageUrl: article.image_url,
      newsSite: article.news_site,
      publishedAt: article.published_at,
      url: article.url
    }));

    // 💡 THE SPLITTING ENGINE: Group articles into blocks of 10 items per page file
    const pageSize = 10;
    const totalPages = Math.ceil(streamlinedNews.length / pageSize);

    for (let page = 1; page <= totalPages; page++) {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageSlice = streamlinedNews.slice(startIndex, endIndex);

      // This creates news_page1.json, news_page2.json, etc. inside your repo
      const fileName = `news_page${page}.json`;
      fs.writeFileSync(fileName, JSON.stringify(pageSlice, null, 2));
      console.log(`💾 Saved ${fileName} cleanly with ${pageSlice.length} articles.`);
    }

    // Keep the main news.json file identical to page 1 so old app builds don't break
    if (totalPages > 0) {
      const mainSlice = streamlinedNews.slice(0, pageSize);
      fs.writeFileSync('news.json', JSON.stringify(mainSlice, null, 2));
    }

    console.log("🚀 Complete! All news data segments successfully formatted.");

  } catch (error) {
    console.error("❌ News pagination task failed: " + error.message);
    process.exit(1);
  }
}

fetchPaginatedSpaceNews();
