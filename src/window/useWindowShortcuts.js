import { useEffect } from "react"

const isEditableTarget = (target) => {
  return target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target?.isContentEditable
}

export const useWindowShortcuts = ({
  activeWindowId,
  openWindow,
  closeWindow,
  switchWindow
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const hasCommandModifier = event.metaKey || event.ctrlKey
      if (!hasCommandModifier) {
        return
      }

      const key = event.key.toLowerCase()
      const targetIsEditable = isEditableTarget(event.target)
      if (targetIsEditable) {
        return
      }

      if (key === "t") {
        event.preventDefault()
        openWindow("terminal")
        return
      }

      if (key === "w" && activeWindowId) {
        event.preventDefault()
        closeWindow(activeWindowId)
        return
      }

      if (key === "tab") {
        event.preventDefault()
        switchWindow()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeWindowId, closeWindow, openWindow, switchWindow])
}
