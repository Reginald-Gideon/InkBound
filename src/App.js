import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import MangaDetailPage from './pages/MangaDetailPage'
import ChapterReaderPage from './pages/ChapterReaderPage'
import BookmarksPage from './pages/BookmarksPage'

export default function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Lazy initial state: this function only runs ONCE, on first render,
  // to read whatever was saved last time instead of always starting empty.
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('bookmarks')
    return saved ? JSON.parse(saved) : []
  })

  // Whenever bookmarks changes, save it back to localStorage
  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  const isBookmarked = (id) => bookmarks.some((b) => b.id === id)

  const toggleBookmark = (manga) => {
    setBookmarks((prev) =>
      isBookmarked(manga.id)
        ? prev.filter((b) => b.id !== manga.id) // remove it
        : [...prev, manga] // add it
    )
  }

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:4000/api/search?title=${encodeURIComponent(searchTerm)}`)
      if (!response.ok) {
        throw new Error(`MangaDex responded with status ${response.status}`)
      }
      const data = await response.json()
      setResults(data.data)
    } catch (err) {
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <SearchPage
            query={query}
            setQuery={setQuery}
            results={results}
            loading={loading}
            error={error}
            onSearch={handleSearch}
            bookmarkCount={bookmarks.length}
          />
        }
      />
      <Route
        path="/manga/:id"
        element={
          <MangaDetailPage
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
          />
        }
      />
      <Route path="/chapter/:id" element={<ChapterReaderPage />} />
      <Route
        path="/bookmarks"
        element={<BookmarksPage bookmarks={bookmarks} bookmarkCount={bookmarks.length} />}
      />
    </Routes>
  )
}