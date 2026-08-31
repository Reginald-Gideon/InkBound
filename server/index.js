import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

// GET /api/search - search manga by title
app.get('/api/search', async (req, res) => {
  const title = req.query.title

  if (!title) {
    return res.status(400).json({ error: 'title query param is required' })
  }

  try {
    const params = new URLSearchParams({
      title,
      limit: 20,
      'includes[]': 'cover_art',
      'contentRating[]': 'safe',
    })

    const response = await fetch(`https://api.mangadex.org/manga?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`MangaDex responded with status ${response.status}`)
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch from MangaDex' })
  }
})

// GET /api/manga/popular - a handful of popular manga for the homepage hero
// Must come BEFORE /api/manga/:id, or Express matches "popular" as an :id
// GET /api/manga/popular - popular manga (used for hero AND the "Popular Today" row)
app.get('/api/manga/popular', async (req, res) => {
  const limit = req.query.limit || 5

  try {
    const params = new URLSearchParams({
      limit,
      'includes[]': 'cover_art',
      'order[followedCount]': 'desc',
      'contentRating[]': 'safe',
    })

    const response = await fetch(`https://api.mangadex.org/manga?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`MangaDex responded with status ${response.status}`)
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch popular manga' })
  }
})

// GET /api/manga/latest - recently updated manga, for "Latest Releases"
app.get('/api/manga/latest', async (req, res) => {
  try {
    const params = new URLSearchParams({
      limit: 10,
      'includes[]': 'cover_art',
      'order[latestUploadedChapter]': 'desc',
      'contentRating[]': 'safe',
    })

    const response = await fetch(`https://api.mangadex.org/manga?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`MangaDex responded with status ${response.status}`)
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch latest releases' })
  }
})

// GET /api/manga/:id - fetch one manga's details
app.get('/api/manga/:id', async (req, res) => {
  const { id } = req.params

  try {
    const params = new URLSearchParams({
      'includes[]': 'cover_art',
    })

    const response = await fetch(`https://api.mangadex.org/manga/${id}?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`MangaDex responded with status ${response.status}`)
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch manga details' })
  }
})

// GET /api/manga/:id/chapters - fetch chapter list for a manga (language-aware)
app.get('/api/manga/:id/chapters', async (req, res) => {
  const { id } = req.params
  const lang = req.query.lang || 'en'

  try {
    const params = new URLSearchParams({
      'translatedLanguage[]': lang,
      'order[chapter]': 'asc',
      limit: 100,
    })

    const response = await fetch(`https://api.mangadex.org/manga/${id}/feed?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`MangaDex responded with status ${response.status}`)
    }

    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch chapters' })
  }
})

// GET /api/chapter/:id/pages - get image URLs for a chapter
app.get('/api/chapter/:id/pages', async (req, res) => {
  const { id } = req.params

  try {
    let response
    let lastError

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await fetch(`https://api.mangadex.org/at-home/server/${id}`)
        if (response.ok) break
      } catch (err) {
        lastError = err
        console.log(`Attempt ${attempt} failed, retrying...`)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    if (!response || !response.ok) {
      throw lastError || new Error(`MangaDex responded with status ${response?.status}`)
    }

    const data = await response.json()
    const pageUrls = data.chapter.data.map(
      (filename) => `${data.baseUrl}/data/${data.chapter.hash}/${filename}`
    )

    res.json({ pages: pageUrls })
  } catch (err) {
    console.error(err)
    res.status(502).json({ error: 'Failed to fetch chapter pages after retries' })
  }
})

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000')
})