import { useContext } from "react"
import { DesktopSettingsContext } from "./settingsContext"

export const useDesktopSettings = () => {
  const context = useContext(DesktopSettingsContext)

  if (!context) {
    throw new Error("useDesktopSettings must be used inside DesktopSettingsProvider")
  }

  return context
}
