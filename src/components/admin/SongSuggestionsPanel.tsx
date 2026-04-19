import { useState, useEffect } from 'react'
import { listSongSuggestions, deleteSongSuggestion } from '@/lib/queries'

interface SongRow {
  id:               string
  spotify_track_id: string
  track_name:       string
  artist_name:      string
  album_name:       string
  album_image_url:  string | null
  suggested_at:     string
}

export function SongSuggestionsPanel() {
  const [songs,    setSongs]    = useState<SongRow[]>([])
  const [loading,  setLoading]  = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const data = await listSongSuggestions()
      setSongs(data as SongRow[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await deleteSongSuggestion(id)
      setSongs((prev) => prev.filter((s) => s.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="admin-card space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium" style={{ color: '#c0b8b0', letterSpacing: '1px' }}>
          Canciones sugeridas
          {!loading && <span style={{ color: '#7a6a60', marginLeft: '8px' }}>({songs.length})</span>}
        </h2>
      </div>

      {loading && (
        <p className="text-xs" style={{ color: '#7a6a60' }}>Cargando…</p>
      )}

      {!loading && songs.length === 0 && (
        <p className="text-xs" style={{ color: '#7a6a60' }}>Todavía no hay canciones sugeridas.</p>
      )}

      {!loading && songs.length > 0 && (
        <ul className="space-y-2">
          {songs.map((song) => (
            <li key={song.id} className="flex items-center gap-4" style={{ padding: '10px 0', borderBottom: '1px solid #2e2e2e' }}>
              {song.album_image_url && (
                <img src={song.album_image_url} alt={song.album_name} style={{ width: 48, height: 48, borderRadius: 4, flexShrink: 0, objectFit: 'cover' }} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#e8e0d8' }}>{song.track_name}</p>
                <p className="text-xs truncate" style={{ color: '#a09080' }}>{song.artist_name}</p>
              </div>
              <a
                href={`https://open.spotify.com/track/${song.spotify_track_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn-ghost shrink-0"
                style={{ padding: '4px 10px', fontSize: '11px' }}
              >
                ▶ Spotify
              </a>
              <button
                onClick={() => handleDelete(song.id)}
                disabled={deleting === song.id}
                className="admin-btn-ghost shrink-0"
                style={{ padding: '4px 10px', fontSize: '11px', color: '#e07070' }}
              >
                {deleting === song.id ? '…' : 'Eliminar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
