//    const apiUrl = "https://api.spaceflightnewsapi.net/v4/articles/?limit=10";
// fetch_news.js - Free Spaceflight News API Ingestion Engine
const fs = require('fs');

async function fetchSpaceNews() {
  try {
    console.log("🌐 Connecting to Spaceflight News API v4...");
    
    // Querying the official v4 articles endpoint limited to the top 10 rows
    const apiUrl = "https://api.spaceflightnewsapi.net/v4/articles/?limit=10";
    
    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "OrbitLogiOSApp/1.0.3 (GitHub-Action-Agent)" }
    });

    if (!response.ok) throw new Error(`HTTP network error: ${response.status}`);
    const data = await response.json();

    // Map the v4 payload properties cleanly into a lightweight data structure for your iPhone
    const streamlinedNews = data.results.map(article => ({
      id: article.id,
      title: article.title.trim(),
      summary: article.summary.trim(),
      imageUrl: article.image_url,
      newsSite: article.news_site,
      publishedAt: article.published_at,
      url: article.url
    }));

    // Write the clean array out as a flat, static JSON text asset file
    fs.writeFileSync('news.json', JSON.stringify(streamlinedNews, null, 2));
    console.log(`💾 Success! news.json written cleanly with ${streamlinedNews.length} articles.`);

  } catch (error) {
    console.error("❌ News collection task failed: " + error.message);
    process.exit(1);
  }
}

fetchSpaceNews();

