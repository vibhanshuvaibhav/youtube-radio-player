import React, { useState, useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import addLink from '../Actions/addLink'
import { addLinkNext, setStation } from '../Actions/playerActions'
import { searchYouTube } from '../utils/youtubeSearch'

const moods = ['Focus', 'Chill', 'Energy', 'Feel-good']
const genres = ['Indie', 'Pop', 'Electronic', 'Hip-hop', 'Bollywood', 'Jazz']

function SearchResultItem({ item, onAdd, onPlayNext, isAdded }) {
  const handleDragStart = e => {
    const trackPayload = {
      id: item.id,
      link: item.link,
      title: item.title,
      thumbnail: item.thumbnail,
      addedAt: new Date().toISOString(),
    }
    e.dataTransfer.setData('application/json', JSON.stringify(trackPayload))
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div
      className="search-result-item"
      draggable
      onDragStart={handleDragStart}
      title="Drag onto Queue panel or click + Queue to add"
    >
      <div className="search-thumb-wrap">
        <img src={item.thumbnail} alt="" onError={e => (e.currentTarget.style.display = 'none')} />
        <span className="drag-handle-badge" aria-hidden="true">⋮⋮</span>
      </div>
      <div className="search-result-info">
        <h4 className="search-result-title">{item.title}</h4>
        <p className="search-result-channel">{item.channel || 'YouTube Track'}</p>
      </div>
      <div className="search-result-actions">
        <button
          type="button"
          className="result-action-btn secondary"
          onClick={() => onPlayNext(item)}
          title="Insert track to play next"
        >
          ▶ Play Next
        </button>
        <button
          type="button"
          className={isAdded ? 'result-action-btn primary added' : 'result-action-btn primary'}
          onClick={() => onAdd(item)}
        >
          {isAdded ? '✓ Added' : '+ Queue'}
        </button>
      </div>
    </div>
  )
}

function StationBuilder({ addLink, addLinkNext, setStation, links = [] }) {
  const [mood, setMood] = useState('Focus')
  const [genre, setGenre] = useState('Indie')
  const [prompt, setPrompt] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [message, setMessage] = useState('')

  // Optional API key stored in localStorage
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('radio_room_yt_api_key') || '')
  const [showSettings, setShowSettings] = useState(false)

  const station = useMemo(() => {
    const terms = [prompt.trim(), mood, genre, 'music'].filter(Boolean)
    const query = terms.join(' ')
    return { label: prompt.trim() || `${mood} ${genre}`, query, mood, genre }
  }, [prompt, mood, genre])

  // Track existing queued IDs directly from Redux store state
  const queuedIds = useMemo(() => new Set((links || []).map(l => l.id)), [links])

  const performSearch = async queryToSearch => {
    const q = queryToSearch || searchQuery || station.query
    if (!q.trim()) return

    setIsSearching(true)
    setMessage('')
    try {
      const results = await searchYouTube(q, apiKey)
      setSearchResults(results)
      if (results.length === 0) {
        setMessage('No search results found. Try another search term.')
      }
    } catch (err) {
      console.error('In-app search error:', err)
      setMessage('Search request failed. Please check your internet connection.')
    } finally {
      setIsSearching(false)
    }
  }

  // Initial search load on station vibe selection
  useEffect(() => {
    performSearch(station.query)
  }, [station.query])

  const handleSearchSubmit = e => {
    e.preventDefault()
    performSearch()
  }

  const handleAddSearchResult = item => {
    addLink({
      id: item.id,
      link: item.link,
      title: item.title,
      thumbnail: item.thumbnail,
      addedAt: new Date().toISOString(),
    })
    setMessage(`Added "${item.title}" to queue.`)
    setTimeout(() => setMessage(''), 3000)
  }

  const handlePlayNextSearchResult = item => {
    addLinkNext({
      id: item.id,
      link: item.link,
      title: item.title,
      thumbnail: item.thumbnail,
      addedAt: new Date().toISOString(),
    })
    setMessage(`Set "${item.title}" to play next.`)
    setTimeout(() => setMessage(''), 3000)
  }

  const saveApiKey = val => {
    setApiKey(val)
    localStorage.setItem('radio_room_yt_api_key', val.trim())
  }

  return (
    <div className="discovery-content">
      <div className="section-heading">
        <div className="heading-top-row">
          <p className="eyebrow">SMART RADIO SEARCH</p>
          <button
            type="button"
            className="settings-toggle-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Configure optional YouTube API Key"
          >
            ⚙ {showSettings ? 'Close Settings' : 'API Key Settings'}
          </button>
        </div>
        <h1>Search & Queue</h1>
        <p>
          Radio Room allows you to queue songs based on your vibe. Simply search and add songs to the queue as they come to your mind and let it play. No old-fashioned playlists.
        </p>
      </div>

      {showSettings && (
        <div className="settings-card">
          <h3>Optional YouTube Data API v3 Key</h3>
          <p>
            Radio Room uses built-in smart search automatically. If you have your own YouTube API Key, paste it here for official quota search access.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={e => saveApiKey(e.target.value)}
            placeholder="AIzaSy..."
          />
        </div>
      )}

      {/* Main Search Bar */}
      <div className="smart-search-card">
        <form className="smart-search-form" onSubmit={handleSearchSubmit}>
          <div className="search-input-group">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              className="smart-search-input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search song title, artist, or album... (e.g. Coldplay Yellow)"
            />
            <button type="submit" className="button primary search-btn" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Station Filter Chips */}
        <div className="vibe-quick-bar">
          <span className="vibe-label">Station Vibe</span>
          <div className="vibe-chips-wrap">
            {moods.map(item => (
              <button
                type="button"
                className={mood === item ? 'chip active' : 'chip'}
                onClick={() => {
                  setMood(item)
                  performSearch(`${item} ${genre} music`)
                }}
                key={item}
              >
                {item}
              </button>
            ))}
            {genres.map(item => (
              <button
                type="button"
                className={genre === item ? 'chip active' : 'chip'}
                onClick={() => {
                  setGenre(item)
                  performSearch(`${mood} ${item} music`)
                }}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results List */}
        <div className="search-results-section">
          <div className="search-results-header">
            <h3>Top Results</h3>
            <span className="drag-hint">💡 Drag & Drop or click + Queue</span>
          </div>

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}

          {isSearching ? (
            <div className="search-loading-state">
              <div className="spinner" />
              <p>Searching YouTube for tracks...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="search-results-list">
              {searchResults.map(item => (
                <SearchResultItem
                  key={item.id}
                  item={item}
                  onAdd={handleAddSearchResult}
                  onPlayNext={handlePlayNextSearchResult}
                  isAdded={queuedIds.has(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="search-empty-state">
              Type a song name above or click any vibe chip to load top YouTube results.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  links: state.links?.links || [],
})

export default connect(mapStateToProps, { addLink, addLinkNext, setStation })(StationBuilder)
