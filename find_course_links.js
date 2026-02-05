const https = require('https');
try { require('dotenv').config({ path: '.env.local' }); } catch (e) { console.log('dotenv not found, relying on env vars if set'); }

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

const courses = [
    "Tally.ERP9", 
    "CCC", 
    "ADCA", 
    "O-Level", 
    "Adobe Photoshop", 
    "CorelDRAW"
];

function searchChannel(query) {
    return new Promise((resolve, reject) => {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&q=${encodeURIComponent(query)}&part=snippet&type=video,playlist&maxResults=1`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.items && json.items.length > 0) {
                        const item = json.items[0];
                        const id = item.id.videoId || item.id.playlistId;
                        const type = item.id.videoId ? 'video' : 'playlist';
                        const link = item.id.videoId 
                            ? `https://www.youtube.com/watch?v=${id}` 
                            : `https://www.youtube.com/playlist?list=${id}`;
                        
                        resolve({ query, title: item.snippet.title, link });
                    } else {
                        resolve({ query, title: "Not Found", link: null });
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    console.log("Searching for courses...");
    for (const course of courses) {
        const result = await searchChannel(course);
        console.log(`[${course}] -> ${result.link} (${result.title})`);
    }
}

run();
