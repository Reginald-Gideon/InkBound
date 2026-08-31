import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function LatestReleases() {
  const [manga, setManga] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:4000/api/manga/latest')
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
    <section className="latest-section">
      <div className="section-head">
        <h2 className="section-title">Latest Releases</h2>
      </div>
      <div className="releases-list">
        {manga.map((m) => {
          const title = m.attributes.title.en || 'Untitled'
          const coverRel = m.relationships.find((r) => r.type === 'cover_art')
          const coverFileName = coverRel?.attributes?.fileName
          const coverUrl = coverFileName
            ? `https://uploads.mangadex.org/covers/${m.id}/${coverFileName}.256.jpg`
            : null

          return (
            <Link key={m.id} to={`/manga/${m.id}`} className="release-row">
              <div className="release-thumb">
                {coverUrl && <img src={coverUrl} alt={title} loading="lazy" />}
              </div>
              <div className="release-info">
                <p className="release-title">{title}</p>
                <p className="release-status">{m.attributes.status}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}