import { lazy } from "react"

export const APP_REGISTRY = {
  terminal: {
    id: "terminal",
    label: "Terminal",
    Component: lazy(() => import("./terminal/TerminalApp"))
  },
  github: {
    id: "github",
    label: "Projects",
    Component: lazy(() => import("./github/GithubApp"))
  },
  notes: {
    id: "notes",
    label: "Notes",
    Component: lazy(() => import("./notes/NotesApp"))
  },
  resume: {
    id: "resume",
    label: "Resume",
    Component: lazy(() => import("./resume/ResumeApp"))
  },
  calendar: {
    id: "calendar",
    label: "Calendar",
    Component: lazy(() => import("./calendar/CalendarApp"))
  },
  spotify: {
    id: "spotify",
    label: "Spotify",
    Component: lazy(() => import("./spotify/SpotifyApp"))
  }
}
