import React from "react"
import { connect } from 'react-redux'

function Header({ station }) {
  return (
    <header className="site-header">
      <div className="header-brand-wrap">
        <a className="brand" href="#top" aria-label="Radio Room home">
          <span className="brand-mark" aria-hidden="true">◉</span>
          <span>Radio Room</span>
        </a>
        <span className="brand-tagline">
          Say good-bye to old-fashioned playlists and say hi! to vibe listening.
        </span>
      </div>
      <div className="header-copy">
        <span className="status-dot" aria-hidden="true" />
        <span>{station ? `Station: ${station.label}` : 'Live'}</span>
      </div>
    </header>
  )
}

const mapStateToProps = state => ({ station: state.links?.station })

export default connect(mapStateToProps)(Header)
