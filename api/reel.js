const { instagramGetUrl } = require('instagram-url-direct');
const ogs = require('open-graph-scraper');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        console.log(`[Vercel Function] Fetching data for: ${url}`);

        // Run both requests in parallel for faster response
        const [ogResult, links] = await Promise.allSettled([
            ogs({ url }),
            instagramGetUrl(url)
        ]);

        // Extract OG metadata (non-critical, so we handle failure gracefully)
        let caption = "Instagram Reel";
        let thumbnail = "";

        if (ogResult.status === 'fulfilled') {
            const meta = ogResult.value.result;
            caption = meta.ogDescription || meta.ogTitle || "Instagram Reel";
            thumbnail = meta.ogImage && meta.ogImage.length > 0 ? meta.ogImage[0].url : "";
        } else {
            console.warn('OG scraping failed, using defaults:', ogResult.reason?.message);
        }

        // Extract video URL (critical)
        if (links.status === 'rejected') {
            console.error('instagram-url-direct failed:', links.reason?.message);
            return res.status(500).json({ error: 'Failed to extract video URL', details: links.reason?.message });
        }

        const videoUrl = links.value.url_list && links.value.url_list.length > 0 ? links.value.url_list[0] : null;

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
};
