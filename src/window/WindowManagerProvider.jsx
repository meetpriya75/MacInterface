import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { WindowManagerContext } from "./managerContext"
import { createDefaultWindow, getWindowDefinition, WINDOW_DEFINITIONS } from "./windowConfig"
import { getNextZIndex, loadWindowState, saveWindowState } from "./windowStorage"

const getTopVisibleWindowId = (windows, excludeId) => {
  return Object.values(windows)
    .filter(currentWindow => currentWindow.id !== excludeId && currentWindow.isOpen && !currentWindow.isMinimized)
    .sort((a, b) => b.zIndex - a.zIndex)[0]?.id ?? null
}

export const WindowManagerProvider = ({ children }) => {
  const persistedState = useMemo(() => loadWindowState(), [])
  const [windows, setWindows] = useState(persistedState.windows)
  const [activeWindowId, setActiveWindowId] = useState(persistedState.activeWindowId)
  const nextZIndex = useRef(getNextZIndex(persistedState.windows))

  const allocateZIndex = useCallback(() => {
    const zIndex = nextZIndex.current
    nextZIndex.current += 1
    return zIndex
  }, [])

  const focusWindow = useCallback((id) => {
    if (!WINDOW_DEFINITIONS[id]) {
      return
    }

    const zIndex = allocateZIndex()
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: true,
        isMinimized: false,
        zIndex
      }
    }))
    setActiveWindowId(id)
  }, [allocateZIndex])

  const openWindow = useCallback((id) => {
    focusWindow(id)
  }, [focusWindow])

  const restoreWindow = useCallback((id) => {
    focusWindow(id)
  }, [focusWindow])

  const minimizeWindow = useCallback((id) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true
      }
    }))
    setActiveWindowId(prev => prev === id ? null : prev)
  }, [])

  const closeWindow = useCallback((id) => {
    const definition = getWindowDefinition(id)
    if (!definition) {
      return
    }

    setWindows(prev => {
      const nextWindows = {
        ...prev,
        [id]: createDefaultWindow(definition)
      }

      setActiveWindowId(prevActiveId => {
        if (prevActiveId !== id) {
          return prevActiveId
        }

        return getTopVisibleWindowId(nextWindows, id)
      })

      return nextWindows
    })
  }, [])

  const toggleWindow = useCallback((id) => {
    const currentWindow = windows[id]
    if (!currentWindow) {
      return
    }

    if (!currentWindow.isOpen || currentWindow.isMinimized) {
      restoreWindow(id)
      return
    }

    if (activeWindowId === id) {
      minimizeWindow(id)
      return
    }

    focusWindow(id)
  }, [activeWindowId, focusWindow, minimizeWindow, restoreWindow, windows])

  const blurWindow = useCallback(() => {
    setActiveWindowId(null)
  }, [])

  const updateWindowPosition = useCallback((id, position) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        position
      }
    }))
  }, [])

  const updateWindowSize = useCallback((id, size) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        size
      }
    }))
  }, [])

  const switchWindow = useCallback(() => {
    const visibleWindows = Object.values(windows)
      .filter(currentWindow => currentWindow.isOpen && !currentWindow.isMinimized)
      .sort((a, b) => a.zIndex - b.zIndex)

    if (visibleWindows.length === 0) {
      return
    }

    const currentIndex = visibleWindows.findIndex(currentWindow => currentWindow.id === activeWindowId)
    const nextWindow = visibleWindows[(currentIndex + 1) % visibleWindows.length]
    focusWindow(nextWindow.id)
  }, [activeWindowId, focusWindow, windows])

  useEffect(() => {
    saveWindowState({ windows, activeWindowId })
  }, [activeWindowId, windows])

  const value = useMemo(() => ({
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    toggleWindow,
    focusWindow,
    blurWindow,
    switchWindow,
    updateWindowPosition,
    updateWindowSize
  }), [
    activeWindowId,
    blurWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    openWindow,
    restoreWindow,
    switchWindow,
    toggleWindow,
    updateWindowPosition,
    updateWindowSize,
    windows
  ])

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  )
}
