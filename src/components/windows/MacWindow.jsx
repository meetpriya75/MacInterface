import { memo, useCallback, useEffect, useRef, useState } from "react"
import { Rnd } from "react-rnd"
import { useWindowManager } from "../../window/useWindowManager"
import "./window.scss"

const getIsMobile = () => globalThis.window.matchMedia("(max-width: 768px)").matches
const SNAP_THRESHOLD = 28
const FULLSCREEN_Z_INDEX = 20000

const MacWindow = ({ window: managedWindow, children }) => {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    updateWindowPosition,
    updateWindowSize
  } = useWindowManager()

  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isMinimizing, setIsMinimizing] = useState(false)
  const [isSnapping, setIsSnapping] = useState(false)
  const [isMobile, setIsMobile] = useState(getIsMobile)
  const dragFrame = useRef(null)
  const latestDragPosition = useRef(managedWindow.position)

  const isActive = activeWindowId === managedWindow.id

  useEffect(() => {
    const mediaQuery = globalThis.window.matchMedia("(max-width: 768px)")
    const handleMediaChange = (event) => setIsMobile(event.matches)

    mediaQuery.addEventListener("change", handleMediaChange)
    return () => mediaQuery.removeEventListener("change", handleMediaChange)
  }, [])

  useEffect(() => {
    return () => {
      if (dragFrame.current) {
        cancelAnimationFrame(dragFrame.current)
      }
    }
  }, [])

  const handleClose = () => {
    setIsClosing(true)
    globalThis.window.setTimeout(() => closeWindow(managedWindow.id), 180)
  }

  const handleMinimize = () => {
    setIsMinimizing(true)
    globalThis.window.setTimeout(() => minimizeWindow(managedWindow.id), 180)
  }

  const handleDrag = useCallback((e, data) => {
    latestDragPosition.current = { x: data.x, y: data.y }

    if (dragFrame.current) {
      return
    }

    dragFrame.current = requestAnimationFrame(() => {
      dragFrame.current = null
    })
  }, [])

  const handleDragStop = (event, data) => {
    latestDragPosition.current = { x: data.x, y: data.y }

    if (data.y <= SNAP_THRESHOLD) {
      setIsSnapping(true)
      setIsFullScreen(true)
      globalThis.window.setTimeout(() => setIsSnapping(false), 220)
      return
    }

    const viewportWidth = globalThis.window.innerWidth
    const halfWidth = Math.round(viewportWidth / 2)

    if (data.x <= SNAP_THRESHOLD) {
      setIsSnapping(true)
      setIsFullScreen(false)
      updateWindowPosition(managedWindow.id, { x: 0, y: 0 })
      updateWindowSize(managedWindow.id, {
        width: `${halfWidth}px`,
        height: "100dvh"
      })
      globalThis.window.setTimeout(() => setIsSnapping(false), 220)
      return
    }

    if (data.x + halfWidth >= viewportWidth - SNAP_THRESHOLD) {
      setIsSnapping(true)
      setIsFullScreen(false)
      updateWindowPosition(managedWindow.id, { x: halfWidth, y: 0 })
      updateWindowSize(managedWindow.id, {
        width: `${halfWidth}px`,
        height: "100dvh"
      })
      globalThis.window.setTimeout(() => setIsSnapping(false), 220)
      return
    }

    updateWindowPosition(managedWindow.id, latestDragPosition.current)
  }

  const handleResizeStop = (event, direction, ref, delta, position) => {
    updateWindowSize(managedWindow.id, {
      width: ref.style.width,
      height: ref.style.height
    })
    updateWindowPosition(managedWindow.id, position)
  }

  const toggleFullScreen = () => {
    focusWindow(managedWindow.id)
    setIsFullScreen(prev => !prev)
  }

  const windowSize = {
    width: isFullScreen ? "100vw" : isMobile ? "calc(100vw - 1rem)" : managedWindow.size.width,
    height: isFullScreen ? "100dvh" : isMobile ? "calc(100dvh - 7.5rem)" : managedWindow.size.height
  }

  const windowPosition = isFullScreen
    ? { x: 0, y: 0 }
    : isMobile
      ? { x: 8, y: 44 }
      : managedWindow.position

  const windowClassName = [
    "window",
    isActive ? "active" : "inactive",
    isFullScreen ? "fullscreen" : "",
    isClosing ? "closing" : "",
    isMinimizing ? "minimized" : ""
  ].filter(Boolean).join(" ")

  return (
    <Rnd
      style={{
        zIndex: isFullScreen ? Math.max(managedWindow.zIndex, FULLSCREEN_Z_INDEX) : managedWindow.zIndex,
        pointerEvents: isClosing || isMinimizing ? "none" : "auto"
      }}
      onMouseDown={() => focusWindow(managedWindow.id)}
      bounds="parent"
      dragHandleClassName="window-drag-handle"
      cancel=".window-control, .main-content"
      size={windowSize}
      position={windowPosition}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
      onDragStart={() => focusWindow(managedWindow.id)}
      onResizeStart={() => focusWindow(managedWindow.id)}
      onResizeStop={handleResizeStop}
      className={isSnapping ? "window-rnd snapping" : "window-rnd"}
      minWidth={isMobile ? 280 : 320}
      minHeight={isMobile ? 360 : 260}
      maxWidth="100vw"
      maxHeight="100dvh"
      disableDragging={isFullScreen || isMobile}
      enableResizing={!isFullScreen && !isMobile}
    >
      <div className={windowClassName}>
        <div className="nav window-drag-handle">
          <div className="dots">
            <div
              onClick={handleClose}
              className="dot red window-control"
            >
              <p>X</p>
            </div>

            <div
              className="dot yellow window-control"
              onClick={handleMinimize}
            ></div>

            <div
              className="dot green window-control"
              onClick={toggleFullScreen}
            ></div>
          </div>

          <div className="title">
            <p>shraypriyadarshi - {managedWindow.title}</p>
          </div>
        </div>

        <div className="main-content">
          {!isActive && (
            <button
              type="button"
              className="inactive-click-layer"
              aria-label={`Focus ${managedWindow.title} window`}
              onMouseDown={() => focusWindow(managedWindow.id)}
            />
          )}
          {children}
        </div>
      </div>
    </Rnd>
  )
}

export default memo(MacWindow)
