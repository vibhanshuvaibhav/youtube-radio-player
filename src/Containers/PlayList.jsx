import React, { useState } from "react"
import { connect } from 'react-redux'
import deleteLink from '../Actions/deleteLink'
import increment from '../Actions/increment'
import decrement from '../Actions/decrement'
import addLink from '../Actions/addLink'
import { clearQueue } from '../Actions/playerActions'

function QueueItem({ item, index, count, increment, decrement, deleteLink }) {
  if (!item) return null
  return (
    <li className={index === 0 ? 'queue-item is-current' : 'queue-item'}>
      <img
        src={item.thumbnail}
        alt=""
        onError={event => {
          event.currentTarget.style.visibility = 'hidden'
        }}
      />
      <div className="queue-copy">
        <span className="queue-position">{index === 0 ? 'ON AIR' : String(index + 1).padStart(2, '0')}</span>
        <span className="queue-title" title={item.title}>
          {item.title}
        </span>
      </div>
      <div className="queue-actions">
        <button
          onClick={() => increment(item.id)}
          disabled={index === 0}
          aria-label={`Move ${item.title} up`}
          title="Move up"
        >
          ↑
        </button>
        <button
          onClick={() => decrement(item.id)}
          disabled={index === count - 1}
          aria-label={`Move ${item.title} down`}
          title="Move down"
        >
          ↓
        </button>
        <button
          onClick={() => deleteLink(item.id)}
          aria-label={`Remove ${item.title}`}
          title="Remove from queue"
        >
          ×
        </button>
      </div>
    </li>
  )
}

function PlayList({ links = [], history = [], deleteLink, increment, decrement, clearQueue, addLink }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = e => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    if (!isDragOver) setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = e => {
    e.preventDefault()
    setIsDragOver(false)
    try {
      const dataStr = e.dataTransfer.getData('application/json')
      if (dataStr) {
        const item = JSON.parse(dataStr)
        if (item && item.id) {
          addLink(item)
        }
      }
    } catch (err) {
      console.warn('Invalid drop data:', err)
    }
  }

  return (
    <div
      className={isDragOver ? 'queue-content drag-active' : 'queue-content'}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="queue-heading">
        <div>
          <p className="eyebrow">UP NEXT</p>
          <h2>
            Queue <span>{links.length}</span>
          </h2>
        </div>
        {links.length > 0 && (
          <button className="text-button" onClick={clearQueue}>
            Clear
          </button>
        )}
      </div>

      {isDragOver && <div className="queue-drop-banner">Drop song here to add to queue</div>}

      {links.length === 0 ? (
        <div className="queue-empty">
          Your queue is waiting for its first track. Search or drag songs here.
        </div>
      ) : (
        <ol className="queue-list">
          {links.map((item, index) => (
            <QueueItem
              key={item.id || index}
              item={item}
              index={index}
              count={links.length}
              increment={increment}
              decrement={decrement}
              deleteLink={deleteLink}
            />
          ))}
        </ol>
      )}

      {history.length > 0 && (
        <div className="history">
          <p className="eyebrow">RECENTLY PLAYED</p>
          {history.slice(0, 5).map((item, idx) => (
            <p key={item.id || idx} title={item.title}>
              {item.title}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  links: state.links?.links || [],
  history: state.links?.history || [],
})

export default connect(mapStateToProps, { deleteLink, increment, decrement, clearQueue, addLink })(PlayList)
