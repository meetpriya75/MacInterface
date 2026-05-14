export const WINDOW_DEFINITIONS = {
  terminal: {
    id: "terminal",
    title: "Terminal",
    dockClass: "cli",
    icon: "/doc-icons/cli.svg",
    defaultPosition: { x: 230, y: 150 },
    defaultSize: { width: "60vw", height: "60vh" }
  },
  github: {
    id: "github",
    title: "Projects",
    dockClass: "github",
    icon: "/doc-icons/github.svg",
    defaultPosition: { x: 220, y: 140 },
    defaultSize: { width: "60vw", height: "60vh" }
  },
  notes: {
    id: "notes",
    title: "Notes",
    dockClass: "note",
    icon: "/doc-icons/note.svg",
    defaultPosition: { x: 240, y: 160 },
    defaultSize: { width: "60vw", height: "60vh" }
  },
  resume: {
    id: "resume",
    title: "Resume",
    dockClass: "pdf",
    icon: "/doc-icons/pdf.svg",
    defaultPosition: { x: 250, y: 170 },
    defaultSize: { width: "60vw", height: "60vh" }
  },
  calendar: {
    id: "calendar",
    title: "Calendar",
    dockClass: "calender",
    icon: "/doc-icons/calender.svg",
    defaultPosition: { x: 260, y: 180 },
    defaultSize: { width: "34rem", height: "32rem" }
  },
  spotify: {
    id: "spotify",
    title: "Spotify",
    dockClass: "spotify",
    icon: "/doc-icons/spotify.svg",
    defaultPosition: { x: 280, y: 190 },
    defaultSize: { width: "25vw", height: "60vh" }
  }
}

export const DOCK_EXTERNAL_ITEMS = [
  {
    id: "mail",
    dockClass: "mail",
    icon: "/doc-icons/mail.svg",
    href: "mailto:shraypriyadarshi@gmail.com"
  },
  {
    id: "linkedin",
    dockClass: "link",
    icon: "/doc-icons/link.svg",
    href: "https://www.linkedin.com/in/shray-priyadarshi-20a73b285/"
  }
]

export const createDefaultWindow = (definition, zIndex = 1) => ({
  id: definition.id,
  title: definition.title,
  isOpen: false,
  isMinimized: false,
  position: definition.defaultPosition,
  size: definition.defaultSize,
  zIndex
})

export const createDefaultWindows = () => {
  return Object.values(WINDOW_DEFINITIONS).reduce((windows, definition) => {
    windows[definition.id] = createDefaultWindow(definition)
    return windows
  }, {})
}

export const getWindowDefinition = (id) => WINDOW_DEFINITIONS[id]
