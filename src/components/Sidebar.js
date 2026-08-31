const collections = [
  { name: 'First Reads', color: 'var(--stamp)' },
  { name: 'Top Rated', color: 'var(--violet)' },
  { name: 'Other Realms', color: '#10b981' },
  { name: 'Finished Series', color: '#f59e0b' },
]

const topReaders = [
  { rank: 1, name: 'moonlit_reader', level: 22, initials: 'MR', color: 'rgba(139, 127, 209, 0.3)' },
  { rank: 2, name: 'katsuo_taro', level: 19, initials: 'KT', color: 'rgba(232, 67, 47, 0.3)' },
  { rank: 3, name: 'paperveil', level: 18, initials: 'PV', color: 'rgba(16, 185, 129, 0.3)' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <section>
        <h3 className="sidebar-title">Collections</h3>
        <div className="collections-grid">
          {collections.map((c) => (
            <a
              key={c.name}
              href="#"
              className="collection-card"
              style={{ background: `linear-gradient(to top, ${c.color}33, transparent)` }}
            >
              <span>{c.name}</span>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h3 className="sidebar-title">Top Readers</h3>
        <div className="leaderboard">
          {topReaders.map((r) => (
            <div key={r.rank} className="leaderboard-row">
              <span className={`rank ${r.rank === 1 ? 'gold' : ''}`}>{r.rank}</span>
              <div className="avatar" style={{ background: r.color }}>
                {r.initials}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{r.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'rgba(237, 234, 224, 0.4)' }}>
                  Level {r.level}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="promo-panel">
        <p className="promo-eyebrow">Support the site</p>
        <p style={{ fontSize: 14, color: 'rgba(237, 234, 224, 0.7)' }}>
          Ad slot / membership placeholder
        </p>
      </section>
    </aside>
  )
}