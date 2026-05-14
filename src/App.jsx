import { Suspense, useEffect, useState } from "react"
import { APP_REGISTRY } from "./apps/appRegistry"
import ErrorBoundary from "./components/ErrorBoundary"
import Dock from "./components/Dock"
import Nav from "./components/Nav"
import { DesktopSettingsProvider } from "./desktop/DesktopSettingsProvider"
import { useDesktopSettings } from "./desktop/useDesktopSettings"
import { WindowManagerProvider } from "./window/WindowManagerProvider"
import { useWindowManager } from "./window/useWindowManager"
import { useWindowShortcuts } from "./window/useWindowShortcuts"
import MacWindow from "./components/windows/MacWindow"
import "./app.scss"

const WindowLayer = () => {
  const { windows } = useWindowManager()

  return Object.values(windows)
    .filter(currentWindow => currentWindow.isOpen && !currentWindow.isMinimized)
    .map(currentWindow => {
      const app = APP_REGISTRY[currentWindow.id]
      if (!app) {
        return null
      }

      const AppComponent = app.Component

      return (
        <MacWindow key={currentWindow.id} window={currentWindow}>
          <ErrorBoundary>
            <Suspense fallback={<div className="app-loader">Loading {app.label}...</div>}>
              <AppComponent />
            </Suspense>
          </ErrorBoundary>
        </MacWindow>
      )
    })
}

const Desktop = () => {
  const {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    switchWindow,
    blurWindow
  } = useWindowManager()
  const {
    appearance,
    windowTheme,
    desktopStyle
  } = useDesktopSettings()
  const [isBooting, setIsBooting] = useState(true)
  const [isCompactScreen, setIsCompactScreen] = useState(() => globalThis.window.matchMedia("(max-width: 680px)").matches)

  useWindowShortcuts({
    activeWindowId,
    openWindow,
    closeWindow,
    switchWindow
  })

  useEffect(() => {
    const bootTimer = globalThis.window.setTimeout(() => setIsBooting(false), 3000)
    const mediaQuery = globalThis.window.matchMedia("(max-width: 680px)")
    const handleMediaChange = (event) => setIsCompactScreen(event.matches)

    mediaQuery.addEventListener("change", handleMediaChange)

    return () => {
      globalThis.window.clearTimeout(bootTimer)
      mediaQuery.removeEventListener("change", handleMediaChange)
    }
  }, [])

  return (
    <main
      className={`desktop ${appearance} window-theme-${windowTheme}`}
      style={desktopStyle}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          blurWindow()
        }
      }}
    >
      <Nav />
      <Dock windows={windows} />
      <WindowLayer />

      {isCompactScreen && (
        <div className="mobile-advisory">
          <h1>This experience is best viewed on desktop</h1>
          <p>Windows, drag, resize, and dock interactions work best with a larger screen.</p>
        </div>
      )}

      {isBooting && (
        <div className="boot-screen">
          <div className="boot-card">
            <div className="boot-mark">
              <img src="/navbar-icons/apple.svg" alt="" />
            </div>
            <p className="boot-title">shrayOS</p>
            <p className="boot-subtitle">Initializing desktop experience</p>
            <div className="boot-progress"><span></span></div>
            <div className="boot-status">
              <span>Mounting apps</span>
              <span>Loading window manager</span>
              <span>Ready</span>
            </div>
            <div className="boot-shortcuts">
              <span>⌘T Terminal</span>
              <span>⌘W Close</span>
              <span>⌘Tab Switch</span>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function App() {
  return (
    <DesktopSettingsProvider>
      <WindowManagerProvider>
        <Desktop />
      </WindowManagerProvider>
    </DesktopSettingsProvider>
  )
}

export default App
