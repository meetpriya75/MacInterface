import { memo } from "react"
import { useDesktopSettings } from "../desktop/useDesktopSettings"
import { useWindowManager } from "../window/useWindowManager"
import DateTime from "./DateTime"
import "./nav.scss"

const Nav = () => {
  const { openWindow } = useWindowManager()
  const { toggleAppearance, cycleWallpaper } = useDesktopSettings()

  const handleKeyboardClick = (event, action) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      action()
    }
  }

  const navActionProps = (action) => ({
    role: "button",
    tabIndex: 0,
    onClick: action,
    onKeyDown: (event) => handleKeyboardClick(event, action)
  })

  return (
    <nav>
      <div className="left">
        <div
          className="apple-icon"
          role="button"
          tabIndex={0}
          onClick={toggleAppearance}
          onKeyDown={(event) => handleKeyboardClick(event, toggleAppearance)}
        >
          <img src="./navbar-icons/apple.svg" alt="" />
        </div>
        <div className="nav-item">
          <p {...navActionProps(() => openWindow("resume"))}>Meet Priya</p>
        </div>
        <div className="nav-item">
          <p {...navActionProps(() => openWindow("notes"))}>Notes</p>
        </div>
        <div className="nav-item">
          <p {...navActionProps(() => openWindow("github"))}>Projects</p>
        </div>
        <div className="nav-item">
          <p {...navActionProps(() => openWindow("calendar"))}>Calendar</p>
        </div>
        <div className="nav-item">
          <p {...navActionProps(() => openWindow("spotify"))}>Music</p>
        </div>
        <div className="nav-item">
          <p {...navActionProps(() => openWindow("terminal"))}>Terminal</p>
        </div>
        <div className="nav-item desktop-only">
          <p {...navActionProps(cycleWallpaper)}>Wallpaper</p>
        </div>
      </div>
      <div className="right">
        <div className="nav-icon">
          <img src="/navbar-icons/wifi.svg" alt="" />
        </div>
        <div className="nav-item">
          <DateTime />
        </div>
      </div>
    </nav>
  )
}

export default memo(Nav)
