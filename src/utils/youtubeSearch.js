/**
 * Smart YouTube Search Utility
 * Uses public instances with fallback rotation + optional YouTube Data API v3 key.
 */

const PUBLIC_INSTANCES = [
  'https://invidious.flokinet.to/api/v1/search',
  'https://yt.drgnz.club/api/v1/search',
  'https://invidious.nerdvpn.de/api/v1/search',
  'https://inv.tux.im/api/v1/search',
  'https://invidious.drgns.space/api/v1/search',
  'https://api.piped.private.coffee/search',
]

export async function searchYouTube(query, apiKey = '') {
  const cleanQuery = query.trim()
  if (!cleanQuery) return []

  // 1. If user provided a YouTube Data API v3 key
  if (apiKey && apiKey.trim()) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(
        cleanQuery,
      )}&key=${apiKey.trim()}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        if (data.items && Array.isArray(data.items)) {
          return data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
            link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          }))
        }
      }
    } catch (err) {
      console.warn('Official YouTube API search failed, falling back to public instances:', err)
    }
  }

  // 2. Fallback rotation across public instances
  for (const baseUrl of PUBLIC_INSTANCES) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)

      const isPiped = baseUrl.includes('piped')
      const targetUrl = isPiped
        ? `${baseUrl}?q=${encodeURIComponent(cleanQuery)}`
        : `${baseUrl}?q=${encodeURIComponent(cleanQuery)}&type=video`

      const res = await fetch(targetUrl, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json()
        const items = Array.isArray(data) ? data : data.items || []

        if (Array.isArray(items) && items.length > 0) {
          const results = items
            .filter(item => item.videoId || (item.url && item.url.includes('watch?v=')))
            .slice(0, 10)
            .map(item => {
              const videoId = item.videoId || item.url.split('v=')[1]?.split('&')[0]
              return {
                id: videoId,
                title: item.title || `Video ${videoId}`,
                channel: item.author || item.uploaderName || item.channelTitle || '',
                thumbnail: item.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
                duration: item.lengthSeconds
                  ? `${Math.floor(item.lengthSeconds / 60)}:${String(item.lengthSeconds % 60).padStart(2, '0')}`
                  : '',
                link: `https://www.youtube.com/watch?v=${videoId}`,
              }
            })

          if (results.length > 0) {
            return results
          }
        }
      }
    } catch (e) {
      // Continue trying next instance
    }
  }

  return []
}
