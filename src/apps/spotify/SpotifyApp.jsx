import { memo } from "react"
import "./spotify.scss"

const SpotifyApp = () => {
  return (
    <div className="spotify-app">
      <iframe
        data-testid="embed-iframe"
        style={{ borderRadius: "12px" }}
        src="https://open.spotify.com/embed/album/2Lxoc72vRTGdQfMvj7Ovi1?utm_source=generator&theme=0"
        width="100%"
        height="352"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  )
}

export default memo(SpotifyApp)
