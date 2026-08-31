import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function MangaDetailPage({ isBookmarked, onToggleBookmark }) {
  const { id } = useParams()
  const [manga, setManga] = useState(null)
  const [chapters, setChapters] = useState([])
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadManga() {
      try {
        const res = await fetch(`http://localhost:4000/api/manga/${id}`)
        if (!res.ok) throw new Error('Failed to fetch manga details')
        const data = await res.json()
        setManga(data.data)
      } catch (err) {
        setError(err.message)
      }
    }
    loadManga()
  }, [id])

  useEffect(() => {
    async function loadChapters() {
      setLoading(true)
      try {
        const res = await fetch(
          `http://localhost:4000/api/manga/${id}/chapters?lang=${selectedLanguage}`
        )
        if (!res.ok) throw new Error('Failed to fetch chapters')
        const data = await res.json()
        setChapters(data.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadChapters()
  }, [id, selectedLanguage])

  if (error) return <p className="wrap">{error}</p>
  if (!manga) return <p className="wrap">Loading...</p>

  const title = manga.attributes.title.en || 'Untitled'
  const description = manga.attributes.description.en || 'No description available.'
  const availableLanguages = manga.attributes.availableTranslatedLanguages || []
  const bookmarked = isBookmarked(manga.id)

  const coverRelationship = manga.relationships.find((rel) => rel.type === 'cover_art')
  const coverFileName = coverRelationship?.attributes?.fileName
  const coverUrl = coverFileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.512.jpg`
    : null

  return (
    <div className="manga-detail">
      <div className="detail-header">
        <div className="detail-cover">
          {coverUrl && <img src={coverUrl} alt={title} />}
        </div>
        <div className="detail-info">
          <h1 className="detail-title">{title}</h1>
          <p className="detail-description">{description}</p>

          <div className="detail-actions">
            <button
              className={`btn-bookmark ${bookmarked ? 'active' : ''}`}
              onClick={() => onToggleBookmark(manga)}
            >
              {bookmarked ? '★ Bookmarked' : '☆ Add Bookmark'}
            </button>
          </div>

          <label className="lang-select">
            Language:
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <h2 className="chapters-heading">Chapters</h2>
      {loading ? (
        <p>Loading chapters...</p>
      ) : chapters.length === 0 ? (
        <p>No chapters available in this language.</p>
      ) : (
        <ul className="chapter-list">
          {chapters.map((ch) => (
            <li key={ch.id} className="chapter-item">
              <Link to={`/chapter/${ch.id}`}>
                <span>Chapter {ch.attributes.chapter}: {ch.attributes.title || '(no title)'}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}