import '../App.css'
import { Link } from 'react-router-dom'
import SeriesGrid from '../components/SeriesGrid'

export default function BookmarksPage({ bookmarks }) {
  return (
    <div className="wrap" style={{ paddingTop: 32 }}>
      <Link to="/" style={{ fontSize: 14, color: 'rgba(237, 234, 224, 0.7)' }}>
        ← Back to search
      </Link>
      <h2 className="results-heading" style={{ marginTop: 20 }}>
        Your Bookmarks
      </h2>
      {bookmarks.length === 0 ? (
        <p>No bookmarks yet — find a manga and add one.</p>
      ) : (
        <SeriesGrid results={bookmarks} />
      )}
    </div>
  )
}