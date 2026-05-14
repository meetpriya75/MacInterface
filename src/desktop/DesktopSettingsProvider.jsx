import { useCallback, useMemo, useState } from "react"
import { DesktopSettingsContext } from "./settingsContext"

const wallpapers = [
  {
    name: "monterey",
    url: "https://i.pinimg.com/1200x/02/5e/a7/025ea7621d456af27deee243542a9868.jpg"
  },
  {
    name: "ventura",
    url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"
  },
  {
    name: "sonoma",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80"
  }
]

const windowThemes = ["glass", "solid", "graphite"]

export const DesktopSettingsProvider = ({ children }) => {
  const [appearance, setAppearance] = useState("dark")
  const [wallpaperIndex, setWallpaperIndex] = useState(0)
  const [windowTheme, setWindowTheme] = useState("glass")

  const toggleAppearance = useCallback(() => {
    setAppearance(prev => prev === "dark" ? "light" : "dark")
  }, [])

  const setDesktopTheme = useCallback((theme) => {
    if (theme !== "dark" && theme !== "light") {
      return `Theme "${theme}" is not available. Use "theme dark" or "theme light".`
    }

    setAppearance(theme)
    return `Desktop theme changed to ${theme}.`
  }, [])

  const cycleWallpaper = useCallback(() => {
    setWallpaperIndex(prev => (prev + 1) % wallpapers.length)
  }, [])

  const changeWallpaper = useCallback((wallpaperName) => {
    if (!wallpaperName) {
      cycleWallpaper()
      return `Wallpaper changed. Available wallpapers: ${wallpapers.map(wallpaper => wallpaper.name).join(", ")}.`
    }

    const nextWallpaperIndex = wallpapers.findIndex(wallpaper => wallpaper.name === wallpaperName)
    if (nextWallpaperIndex === -1) {
      return `Wallpaper "${wallpaperName}" is not available. Use: ${wallpapers.map(wallpaper => wallpaper.name).join(", ")}.`
    }

    setWallpaperIndex(nextWallpaperIndex)
    return `Wallpaper changed to ${wallpaperName}.`
  }, [cycleWallpaper])

  const changeWindowTheme = useCallback((themeName) => {
    if (!windowThemes.includes(themeName)) {
      return `Window theme "${themeName}" is not available. Use: ${windowThemes.join(", ")}.`
    }

    setWindowTheme(themeName)
    return `Window theme changed to ${themeName}.`
  }, [])

  const desktopStyle = useMemo(() => ({
    "--wallpaper-image": `url(${wallpapers[wallpaperIndex].url})`
  }), [wallpaperIndex])

  const value = useMemo(() => ({
    appearance,
    windowTheme,
    desktopStyle,
    toggleAppearance,
    setDesktopTheme,
    cycleWallpaper,
    changeWallpaper,
    changeWindowTheme
  }), [
    appearance,
    changeWallpaper,
    changeWindowTheme,
    cycleWallpaper,
    desktopStyle,
    setDesktopTheme,
    toggleAppearance,
    windowTheme
  ])

  return (
    <DesktopSettingsContext.Provider value={value}>
      {children}
    </DesktopSettingsContext.Provider>
  )
}
