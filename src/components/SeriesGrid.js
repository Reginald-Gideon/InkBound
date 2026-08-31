import { Link } from 'react-router-dom'

export default function SeriesGrid({ results = [] }) {
  if (results.length === 0) {
    return <p>No results yet — try searching for something.</p>
  }

  return (
    <div className="series-grid">
      {results.map((manga) => {
        const title = manga.attributes.title.en || 'Untitled'

        const coverRelationship = manga.relationships.find(
          (rel) => rel.type === 'cover_art'
        )
        const coverFileName = coverRelationship?.attributes?.fileName
        const coverUrl = coverFileName
          ? `https://uploads.mangadex.org/covers/${manga.id}/${coverFileName}.256.jpg`
          : null

        return (
          <Link key={manga.id} to={`/manga/${manga.id}`} className="series-card">
            <div className="series-cover">
              {coverUrl && <img src={coverUrl} alt={title} loading="lazy" />}
            </div>
            <p className="series-title">{title}</p>
            <p className="series-status">{manga.attributes.status}</p>
          </Link>
        )
      })}
    </div>
  )
}