export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

const MOCK_VIDEOS: Video[] = [
  {
    id: "mock1",
    title: "How to download certificate Training Management Portal",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg", // Placeholder
    url: "https://www.youtube.com/@LEARNVCI/videos"
  },
  {
    id: "mock2",
    title: "Plant's repatriation system day and night project",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    url: "https://www.youtube.com/@LEARNVCI/videos"
  },
  {
    id: "mock3",
    title: "HTML | By-Mohit Omar | For SSC & Banking",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    url: "https://www.youtube.com/@LEARNVCI/videos"
  },
  {
    id: "mock4",
    title: "Types of Network | By-Mohit Omar",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    url: "https://www.youtube.com/@LEARNVCI/videos"
  },
  {
    id: "mock5",
    title: "Ms Word Home Tab Full Details | Class-03",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    url: "https://www.youtube.com/@LEARNVCI/videos"
  },
  {
    id: "mock6",
    title: "Computer Fundamentals Overview Series",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
    url: "https://www.youtube.com/@LEARNVCI/videos"
  }
];

export async function getChannelVideos(limit: number = 6): Promise<Video[]> {
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    console.warn("YouTube API Key or Channel ID missing. Using mock data.");
    return MOCK_VIDEOS.slice(0, limit);
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=${limit}&type=video`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      console.error("Failed to fetch YouTube videos:", response.statusText);
      return MOCK_VIDEOS.slice(0, limit);
    }

    const data = await response.json();
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));

  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return MOCK_VIDEOS.slice(0, limit);
  }
}
