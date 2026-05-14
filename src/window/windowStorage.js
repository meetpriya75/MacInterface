import { createDefaultWindows, WINDOW_DEFINITIONS } from "./windowConfig"

const STORAGE_KEY = "mac-interface:windows:v1"

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value)

const isValidPosition = (position) => {
  return position &&
    isFiniteNumber(position.x) &&
    isFiniteNumber(position.y)
}

const isValidSizeValue = (value) => {
  return (typeof value === "number" && Number.isFinite(value) && value > 0) ||
    (typeof value === "string" && value.length > 0)
}

const isValidSize = (size) => {
  return size &&
    isValidSizeValue(size.width) &&
    isValidSizeValue(size.height)
}

const sanitizeWindow = (candidate, fallback) => {
  if (!candidate || candidate.id !== fallback.id) {
    return fallback
  }

  return {
    ...fallback,
    isOpen: typeof candidate.isOpen === "boolean" ? candidate.isOpen : fallback.isOpen,
    isMinimized: typeof candidate.isMinimized === "boolean" ? candidate.isMinimized : fallback.isMinimized,
    position: isValidPosition(candidate.position) ? candidate.position : fallback.position,
    size: isValidSize(candidate.size) ? candidate.size : fallback.size,
    zIndex: isFiniteNumber(candidate.zIndex) ? candidate.zIndex : fallback.zIndex
  }
}

export const loadWindowState = () => {
  const fallbackWindows = createDefaultWindows()

  if (typeof window === "undefined") {
    return { windows: fallbackWindows, activeWindowId: null }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { windows: fallbackWindows, activeWindowId: null }
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object" || !parsed.windows) {
      return { windows: fallbackWindows, activeWindowId: null }
    }

    const windows = Object.values(WINDOW_DEFINITIONS).reduce((validatedWindows, definition) => {
      validatedWindows[definition.id] = sanitizeWindow(parsed.windows[definition.id], fallbackWindows[definition.id])
      return validatedWindows
    }, {})

    const activeWindowId = windows[parsed.activeWindowId]?.isOpen && !windows[parsed.activeWindowId]?.isMinimized
      ? parsed.activeWindowId
      : null

    return { windows, activeWindowId }
  } catch {
    return { windows: fallbackWindows, activeWindowId: null }
  }
}

export const saveWindowState = (state) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage may be unavailable in private mode; the app should continue without persistence.
  }
}

export const getNextZIndex = (windows) => {
  return Object.values(windows).reduce((highest, currentWindow) => {
    return Math.max(highest, currentWindow.zIndex)
  }, 1) + 1
}
