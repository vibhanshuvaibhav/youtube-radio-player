const initialState = {
  links: [],
  history: [],
  likedIds: [],
  dislikedIds: [],
  station: null,
}

function normalizeLink(link) {
  if (!link || typeof link !== 'object') return null
  const linkStr = typeof link.link === 'string' ? link.link : ''
  const titleStr = typeof link.title === 'string' ? link.title : ''

  const videoId =
    link.id ||
    (linkStr.match(/[?&]v=([\w-]{11})|youtu\.be\/([\w-]{11})|\/(?:shorts|embed|live)\/([\w-]{11})/) || [])
      .slice(1)
      .find(Boolean)
  const id = videoId || linkStr || titleStr || String(Math.random())
  return {
    ...link,
    id,
    link: linkStr || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''),
    title: titleStr || `YouTube video (${id})`,
    thumbnail: link.thumbnail || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ''),
  }
}

function linksReducer(state = initialState, action) {
  const currentRawState = state && typeof state === 'object' ? state : initialState
  const currentState = {
    ...initialState,
    ...currentRawState,
    links: (Array.isArray(currentRawState.links) ? currentRawState.links : []).map(normalizeLink).filter(Boolean),
    history: (Array.isArray(currentRawState.history) ? currentRawState.history : []).map(normalizeLink).filter(Boolean),
    likedIds: Array.isArray(currentRawState.likedIds) ? currentRawState.likedIds : [],
    dislikedIds: Array.isArray(currentRawState.dislikedIds) ? currentRawState.dislikedIds : [],
  }

  switch (action.type) {
    case 'ADD_LINK': {
      if (!action.payload) return currentState
      const normalized = normalizeLink(action.payload)
      if (!normalized) return currentState

      const alreadyQueued = currentState.links.some(link => link.id === normalized.id)
      if (alreadyQueued) return currentState

      return { ...currentState, links: [...currentState.links, normalized] }
    }

    case 'ADD_LINK_NEXT': {
      if (!action.payload) return currentState
      const normalized = normalizeLink(action.payload)
      if (!normalized) return currentState

      const filteredLinks = currentState.links.filter(link => link.id !== normalized.id)
      if (filteredLinks.length === 0) {
        return { ...currentState, links: [normalized] }
      }
      const [current, ...rest] = filteredLinks
      return { ...currentState, links: [current, normalized, ...rest] }
    }

    case 'DELETE_LINK':
      return {
        ...currentState,
        links: currentState.links.filter(link => link.id !== action.payload),
      }

    case 'COMPLETE_CURRENT': {
      const [current, ...remaining] = currentState.links
      if (!current) return currentState

      return {
        ...currentState,
        links: remaining,
        history: [current, ...currentState.history.filter(link => link.id !== current.id)].slice(0, 30),
      }
    }

    case 'INCREMENT': {
      const index = currentState.links.findIndex(link => link.id === action.payload)
      if (index <= 0) return currentState
      const links = [...currentState.links]
      ;[links[index - 1], links[index]] = [links[index], links[index - 1]]
      return { ...currentState, links }
    }

    case 'DECREMENT': {
      const index = currentState.links.findIndex(link => link.id === action.payload)
      if (index < 0 || index === currentState.links.length - 1) return currentState
      const links = [...currentState.links]
      ;[links[index], links[index + 1]] = [links[index + 1], links[index]]
      return { ...currentState, links }
    }

    case 'TOGGLE_LIKE':
      return {
        ...currentState,
        likedIds: currentState.likedIds.includes(action.payload)
          ? currentState.likedIds.filter(id => id !== action.payload)
          : [...currentState.likedIds, action.payload],
        dislikedIds: currentState.dislikedIds.filter(id => id !== action.payload),
      }

    case 'TOGGLE_DISLIKE':
      return {
        ...currentState,
        dislikedIds: currentState.dislikedIds.includes(action.payload)
          ? currentState.dislikedIds.filter(id => id !== action.payload)
          : [...currentState.dislikedIds, action.payload],
        likedIds: currentState.likedIds.filter(id => id !== action.payload),
      }

    case 'SET_STATION':
      return { ...currentState, station: action.payload }

    case 'CLEAR_QUEUE':
      return { ...currentState, links: [] }

    default:
      return currentState
  }
}

export default linksReducer
