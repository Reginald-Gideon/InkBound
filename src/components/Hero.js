import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Hero() {
  const [slides, setSlides] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    async function loadPopular() {
      try {
        const res = await fetch('http://localhost:4000/api/manga/popular')
        const data = await res.json()
        setSlides(data.data)
      } catch (err) {
        console.error(err)
      }
    }
    loadPopular()
  }, [])

  // Auto-advance every 6 seconds
  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides])

  if (slides.length === 0) return null

  const manga = slides[current]
  const title = manga.attributes.title.en || 'Untitled'
  const description = manga.attributes.description.en || ''
  const shortDescription = description.length > 200 ? description.slice(0, 200) + '…' : description

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <span className="hero-tag">{manga.attributes.status}</span>
          <h1 className="hero-title">{title}</h1>
          <p className="hero-desc">{shortDescription}</p>
          <div className="hero-actions">
            <Link to={`/manga/${manga.id}`} className="btn-primary">Start Reading</Link>
          </div>
        </div>
      </div>

      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  )
}