import '../App.css'
import Header from '../components/Header'
import Hero from '../components/Hero'
import PopularToday from '../components/PopularToday'
import LatestReleases from '../components/LatestReleases'
import SeriesGrid from '../components/SeriesGrid'
import Sidebar from '../components/Sidebar'

export default function SearchPage({ query, setQuery, results, loading, error, onSearch, bookmarkCount }) {
  const hasSearched = results.length > 0 || loading || error

  return (
    <div>
      <Header query={query} onQueryChange={setQuery} onSearch={onSearch} bookmarkCount={bookmarkCount} />
      <Hero />
      <div className="main-layout">
        <div>
          {hasSearched ? (
            <>
              {loading && <p>Loading...</p>}
              {error && <p>{error}</p>}
              {results.length > 0 && <h2 className="results-heading">Search Results</h2>}
              <SeriesGrid results={results} />
            </>
          ) : (
            <>
              <PopularToday />
              <LatestReleases />
            </>
          )}
        </div>
        <Sidebar />
      </div>
    </div>
  )
}