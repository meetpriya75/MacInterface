import { useContext } from "react"
import { WindowManagerContext } from "./managerContext"

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext)

  if (!context) {
    throw new Error("useWindowManager must be used inside WindowManagerProvider")
  }

  return context
}
