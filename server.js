const express = require('express');
const { exec } = require('youtube-dl-exec');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/get_audio_url', async (req, res) => {
    const youtubeUrl = req.body.url;

    if (!youtubeUrl || !youtubeUrl.includes('youtube.com/watch?v=')) {
        return res.status(400).json({ error: 'Please provide a valid YouTube URL.' });
    }

    try {
        const result = await exec(youtubeUrl, {
            format: 'bestaudio/best',
            getUrl: true
        });

        // The exec function returns an object with stdout and stderr properties.
        // We need to access the stdout property, which contains the URL as a string.
        const audioUrl = result.stdout;
        
        // Now you can safely trim the string.
        res.status(200).json({ url: audioUrl.trim() });

    } catch (error) {
        console.error('Error fetching audio URL:', error.stderr || error.message);
        res.status(500).json({ error: 'Failed to retrieve audio URL. Check the URL or video availability.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});