import React from "react"
import './App.css'
import Header from './Components/Header'
import RequestForm from './Containers/RequestForm'
import PlayList from './Containers/PlayList'
import Player from './Containers/Player'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <div className="player-queue-column">
          <section className="listen-panel" aria-label="Now playing player">
            <div className="section-tag-header">
              <span className="live-dot" aria-hidden="true" />
              <span>PLAYER STAGE — YOUR SONGS WILL PLAY HERE</span>
            </div>
            <Player />
          </section>
          <aside className="queue-panel" aria-label="Queue">
            <PlayList />
          </aside>
        </div>
        <section className="discovery-panel" aria-label="Search and queue songs">
          <RequestForm />
        </section>
      </main>
    </div>
  )
}

export default App
