import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function ChapterReaderPage() {
  const { id } = useParams()
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadPages() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`http://localhost:4000/api/chapter/${id}/pages`)
        if (!response.ok) {
          throw new Error('Failed to load chapter pages')
        }
        const data = await response.json()
        setPages(data.pages)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadPages()
  }, [id])

  return (
    <div>
      <div className="reader-topbar">
        <Link to="/">← Back to search</Link>
      </div>

      {loading && <p className="wrap">Loading...</p>}
      {error && <p className="wrap">{error}</p>}

      <div className="chapter-reader">
        {pages.map((url, index) => (
          <img key={url} src={url} alt={`Page ${index + 1}`} />
        ))}
      </div>
    </div>
  )
}