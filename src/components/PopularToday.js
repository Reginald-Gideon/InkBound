import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function PopularToday() {
  const [manga, setManga] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:4000/api/manga/popular?limit=10')
        const data = await res.json()
        setManga(data.data || [])
      } catch (err) {
        console.error(err)
        setManga([])
      }
    }
    load()
  }, [])

  if (manga.length === 0) return null

  return (
    <section className="popular-section">
      <div className="section-head">
        <h2 className="section-title">Popular Today</h2>
      </div>
      <div className="popular-row">
        {manga.map((m, index) => {
          const title = m.attributes.title.en || 'Untitled'
          const coverRel = m.relationships.find((r) => r.type === 'cover_art')
          const coverFileName = coverRel?.attributes?.fileName
          const coverUrl = coverFileName
            ? `https://uploads.mangadex.org/covers/${m.id}/${coverFileName}.256.jpg`
            : null

          return (
            <Link key={m.id} to={`/manga/${m.id}`} className="popular-card">
              <div className="popular-cover">
                {coverUrl && <img src={coverUrl} alt={title} loading="lazy" />}
                <span className="rank-badge">#{index + 1}</span>
              </div>
              <p className="popular-title">{title}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}