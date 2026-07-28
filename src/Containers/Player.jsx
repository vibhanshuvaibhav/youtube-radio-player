import React, { useState } from "react"
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'
import { completeCurrent, toggleDislike, toggleLike } from '../Actions/playerActions'

const PlayerComponent = ReactPlayer.default || ReactPlayer

function Player({ links = [], likedIds = [], dislikedIds = [], completeCurrent, toggleLike, toggleDislike }) {
  const [playing, setPlaying] = useState(true)
  const current = links && links[0]

  if (!current) {
    return (
      <div className="empty-player">
        <div className="empty-art" aria-hidden="true">♫</div>
        <p className="eyebrow">YOUR SONGS WILL PLAY HERE</p>
        <h2>Your songs will play here when added to the queue.</h2>
        <p>Type any song name in search or click a vibe chip to load tracks.</p>
      </div>
    )
  }

  const liked = likedIds.includes(current.id)
  const disliked = dislikedIds.includes(current.id)

  return (
    <div className="player-card">
      <div className="video-wrap">
        <PlayerComponent
          url={current.link}
          src={current.link}
          className="react-player"
          width="100%"
          height="100%"
          controls
          playing={playing}
          onEnded={completeCurrent}
          onError={(e) => {
            console.warn('ReactPlayer playback warning:', e)
            setPlaying(false)
          }}
        />
      </div>
      <div className="now-playing">
        <div className="now-playing-copy">
          <p className="eyebrow">NOW PLAYING • YOUR SONGS PLAY HERE</p>
          <h2 title={current.title}>{current.title}</h2>
          {current.link && (
            <a href={current.link} target="_blank" rel="noopener noreferrer">
              Open on YouTube ↗
            </a>
          )}
        </div>
        <div className="player-actions">
          <button
            className="icon-button"
            onClick={() => setPlaying(!playing)}
            aria-label={playing ? 'Pause playback' : 'Play'}
          >
            {playing ? 'Ⅱ' : '▶'}
          </button>
          <button
            className={liked ? 'icon-button selected' : 'icon-button'}
            onClick={() => toggleLike(current.id)}
            aria-label="Like this track"
          >
            ♥
          </button>
          <button
            className={disliked ? 'icon-button selected dislike' : 'icon-button'}
            onClick={() => toggleDislike(current.id)}
            aria-label="Play less like this"
          >
            ⊘
          </button>
          <button className="skip-button" onClick={completeCurrent}>
            Skip <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  links: state.links?.links || [],
  likedIds: state.links?.likedIds || [],
  dislikedIds: state.links?.dislikedIds || [],
})

export default connect(mapStateToProps, { completeCurrent, toggleLike, toggleDislike })(Player)
