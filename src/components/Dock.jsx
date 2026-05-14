import { memo, useMemo, useState } from "react"
import { DOCK_EXTERNAL_ITEMS, WINDOW_DEFINITIONS } from "../window/windowConfig"
import { useWindowManager } from "../window/useWindowManager"
import "./dock.scss"

const Dock = () => {
  const { windows, activeWindowId, toggleWindow } = useWindowManager()
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const dockItems = useMemo(() => [
    ...Object.values(WINDOW_DEFINITIONS).map(item => ({ ...item, type: "window" })),
    ...DOCK_EXTERNAL_ITEMS.map(item => ({ ...item, type: "external" }))
  ], [])

  const getDockScale = (index) => {
    if (hoveredIndex === null) {
      return 1
    }

    const distance = Math.abs(index - hoveredIndex)
    if (distance === 0) {
      return 1.32
    }

    if (distance === 1) {
      return 1.16
    }

    if (distance === 2) {
      return 1.06
    }

    return 1
  }

  return (
    <footer className="dock" onMouseLeave={() => setHoveredIndex(null)}>
      {dockItems.map((item, index) => {
        if (item.type === "external") {
          return (
            <button
              key={item.id}
              type="button"
              onMouseEnter={() => setHoveredIndex(index)}
              onClick={() => window.open(item.href, "_blank")}
              className={`icon ${item.dockClass}`}
              style={{ "--dock-scale": getDockScale(index) }}
              aria-label={`Open ${item.id}`}
            >
              <img src={item.icon} alt="" />
            </button>
          )
        }

        const currentWindow = windows[item.id]
        const isOpen = currentWindow?.isOpen
        const isActive = activeWindowId === item.id

        return (
          <button
            key={item.id}
            type="button"
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() => toggleWindow(item.id)}
            className={[
              "icon",
              item.dockClass,
              isOpen ? "open" : "",
              isActive ? "active" : "",
              currentWindow?.isMinimized ? "minimized" : ""
            ].filter(Boolean).join(" ")}
            style={{ "--dock-scale": getDockScale(index) }}
            aria-label={`Open ${item.title}`}
          >
            <img src={item.icon} alt="" />
          </button>
        )
      })}
    </footer>
  )
}

export default memo(Dock)
