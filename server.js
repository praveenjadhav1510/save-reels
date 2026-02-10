const express = require('express');
const cors = require('cors');
const { instagramGetUrl } = require('instagram-url-direct');
const ogs = require('open-graph-scraper');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoint to fetch reel data
app.get('/api/reel', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        console.log(`Fetching data for: ${url}`);

        // 1. Get Open Graph metadata (title/caption, thumbnail)
        const ogData = await ogs({ url });
        const meta = ogData.result;

        let caption = meta.ogDescription || meta.ogTitle || "Instagram Reel";
        let thumbnail = meta.ogImage && meta.ogImage.length > 0 ? meta.ogImage[0].url : "";

        // 2. Get direct video links using instagram-url-direct
        const links = await instagramGetUrl(url);

        const videoUrl = links.url_list && links.url_list.length > 0 ? links.url_list[0] : null;

        if (!videoUrl) {
            return res.status(404).json({ error: 'Could not find video URL' });
        }

        return res.json({
            videoUrl,
            thumbnail,
            caption
        });

    } catch (error) {
        console.error('Error fetching reel:', error);
        return res.status(500).json({ error: 'Failed to process request', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
