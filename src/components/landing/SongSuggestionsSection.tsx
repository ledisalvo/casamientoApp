import { useState, useEffect } from 'react'
import { searchSpotifyTracks, suggestSong, type SpotifyTrack } from '@/lib/queries'
import { supabase } from '@/lib/supabase'

export function SongSuggestionsSection() {
  const [query,      setQuery]      = useState('')
  const [results,    setResults]    = useState<SpotifyTrack[]>([])
  const [searching,  setSearching]  = useState(false)
  const [suggested,  setSuggested]  = useState<Set<string>>(new Set())
  const [suggesting, setSuggesting] = useState<string | null>(null)
  const [total,      setTotal]      = useState<number>(0)
  const [searchErr,  setSearchErr]  = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('song_suggestions')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setTotal(count ?? 0))
  }, [])

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    setSearchErr(null)
    setResults([])
    try {
      const tracks = await searchSpotifyTracks(query)
      setResults(tracks)
      if (tracks.length === 0) setSearchErr('No encontramos canciones. Probá con otro título o artista.')
    } catch {
      setSearchErr('Error al buscar. Intentá de nuevo.')
    } finally {
      setSearching(false)
    }
  }

  async function handleSuggest(track: SpotifyTrack) {
    setSuggesting(track.id)
    try {
      await suggestSong(track)
      setSuggested((prev) => new Set(prev).add(track.id))
      setTotal((n) => n + 1)
    } catch {
      // silently ignore duplicate or network error
    } finally {
      setSuggesting(null)
    }
  }

  return (
    <section className="songs-section">
      <div className="songs-inner">
        <p className="section-label">música</p>
        <h2 className="songs-title">Armemos la playlist juntos</h2>
        <p className="songs-subtitle">
          Buscá una canción y sugerila para que suene en la fiesta.
          {total > 0 && <span className="songs-count"> Ya hay {total} {total === 1 ? 'canción sugerida' : 'canciones sugeridas'}.</span>}
        </p>

        <form className="songs-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="songs-input"
            placeholder="Título, artista o álbum…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-solid" disabled={searching} style={{ marginTop: 0 }}>
            {searching ? '…' : 'Buscar'}
          </button>
        </form>

        {searchErr && (
          <p className="songs-error">{searchErr}</p>
        )}

        {results.length > 0 && (
          <ul className="songs-results">
            {results.map((track) => {
              const isSuggested = suggested.has(track.id)
              const isSuggesting = suggesting === track.id
              return (
                <li key={track.id} className="songs-track">
                  {track.image && (
                    <img src={track.image} alt={track.album} className="songs-album-art" />
                  )}
                  <div className="songs-track-info">
                    <span className="songs-track-name">{track.name}</span>
                    <span className="songs-track-artist">{track.artist}</span>
                  </div>
                  <button
                    className={isSuggested ? 'songs-btn-done' : 'btn-outline'}
                    style={{ marginTop: 0 }}
                    onClick={() => !isSuggested && handleSuggest(track)}
                    disabled={isSuggested || isSuggesting}
                  >
                    {isSuggesting ? '…' : isSuggested ? '✓ Sugerida' : 'Sugerir'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
