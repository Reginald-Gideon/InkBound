import { Link } from 'react-router-dom'

export default function Header({ query, onQueryChange, onSearch, bookmarkCount = 0 }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <header className="site-header">
      <div className="wrap nav-inner">
        <Link to="/" className="logo">
          <span className="logo-badge">I</span>
          <span className="logo-text">INKBOUND</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <a href="#latest">Latest</a>
          <a href="#browse">Series</a>
          <a href="#collections">Collections</a>
          <Link to="/bookmarks">
            Bookmarks {bookmarkCount > 0 && <sup>{bookmarkCount}</sup>}
          </Link>
        </nav>

        <div className="nav-right">
          <form onSubmit={handleSubmit} className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search titles…"
            />
          </form>
          <button type="button" className="btn-signin">Sign in</button>
        </div>
      </div>
    </header>
  )
}