import { memo, useMemo } from "react"
import Terminal from "react-console-emulator"
import { useDesktopSettings } from "../../desktop/useDesktopSettings"
import { useWindowManager } from "../../window/useWindowManager"
import "./terminal.scss"

const TerminalApp = () => {
  const { openWindow } = useWindowManager()
  const { setDesktopTheme, changeWallpaper, changeWindowTheme } = useDesktopSettings()

  const commands = useMemo(() => ({
    whoami: {
      description: "Who am I",
      usage: "whoami",
      fn: () => `Meet@portfolio

Web Developer | App Developer

I build interactive web applications with a focus on UI/UX and performance.
Currently exploring full-stack development and advanced frontend systems.`
    },
    about: {
      description: "Learn about me",
      usage: "about",
      fn: () => `Hi, I'm Meet Priya 👋

I'm a web developer focused on building interactive and modern user interfaces.
I enjoy creating systems like this MacOS simulator that mimic real-world applications.

Currently improving my skills in:
- Advanced React
- System design for frontend
- Performance optimization`
    },
    skills: {
      description: "View my technical skills",
      usage: "skills",
      fn: () => `Frontend:
- HTML, CSS, SCSS
- JavaScript (Advanced)
- React
- Tailwind CSS

Tools:
- Git & GitHub
- Vite
- Bolt.ai, Create.xyz

Other:
- DSA (JavaScript)
- UI/UX-focused development`
    },
    projects: {
      description: "See my projects",
      usage: "projects",
      fn: () => `1. MacOS Desktop Simulator
   - React-based desktop UI
   - Draggable & resizable windows
   - CLI-based interaction system

2. Portfolio Website (In Progress)
   - Personal portfolio with modern UI

3. Calculator App
   - Built using HTML, CSS, JavaScript

4. Freelance Projects (VTabs)
   - WordPress & GoHighLevel pages`
    },
    experience: {
      description: "Work experience",
      usage: "experience",
      fn: () => `Web Developer Intern @ CipherByte Technologies
- Completed internship with certificate & LOR

Web Development Intern @ InternPE
- Built beginner-level projects

Web Development Intern @ Prodigy InfoTech
- Training-based internship

Freelance Developer @ VTabs
- Built client websites using WordPress & GoHighLevel`
    },
    contact: {
      description: "Get contact details",
      usage: "contact",
      fn: () => `Email: shraypriyadarshi@gmail.com
Location: Kolkata, West Bengal, India

Feel free to reach out for collaboration or opportunities 🚀`
    },
    open: {
      description: "Open an app or external profile",
      usage: "open <notes|terminal|github|linkedin>",
      fn: (target = "") => {
        const normalizedTarget = target.toLowerCase()

        if (normalizedTarget === "github") {
          window.open("https://github.com/Shraysinha", "_blank")
          return "Opening GitHub..."
        }

        if (normalizedTarget === "linkedin") {
          window.open("https://www.linkedin.com/in/shray-priyadarshi-20a73b285/", "_blank")
          return "Opening LinkedIn..."
        }

        const apps = {
          note: "notes",
          notes: "notes",
          terminal: "terminal",
          cli: "terminal",
          projects: "github",
          resume: "resume",
          pdf: "resume",
          calendar: "calendar",
          music: "spotify",
          spotify: "spotify"
        }

        if (apps[normalizedTarget]) {
          openWindow(apps[normalizedTarget])

          if (normalizedTarget === "note" || normalizedTarget === "notes") {
            return "Opening Notes App..."
          }

          if (normalizedTarget === "terminal" || normalizedTarget === "cli") {
            return "Opening Terminal..."
          }

          return `Opening ${normalizedTarget}...`
        }

        return "Unknown target. Try: open notes, open terminal, open github, open linkedin."
      }
    },
    theme: {
      description: "Switch theme",
      usage: "theme <dark|light>",
      fn: (theme = "") => {
        const normalizedTheme = theme.toLowerCase()
        const result = setDesktopTheme(normalizedTheme)

        if (normalizedTheme === "dark" || normalizedTheme === "light") {
          return `Switching to ${normalizedTheme} mode...`
        }

        return result
      }
    },
    wallpaper: {
      description: "Change desktop wallpaper",
      usage: "wallpaper <monterey|ventura|sonoma>",
      fn: (wallpaperName = "") => changeWallpaper(wallpaperName.toLowerCase())
    },
    "window-theme": {
      description: "Change window chrome style",
      usage: "window-theme <glass|solid|graphite>",
      fn: (themeName = "") => changeWindowTheme(themeName.toLowerCase())
    },
    date: {
      description: "Current date",
      usage: "date",
      fn: () => `Current Date: ${new Date().toLocaleDateString()}`
    },
    time: {
      description: "Current time",
      usage: "time",
      fn: () => `Current Time: ${new Date().toLocaleTimeString()}`
    },
    motivation: {
      description: "Tiny push",
      usage: "motivation",
      fn: () => '"Consistency beats talent when talent doesn’t work hard."'
    },
    funfact: {
      description: "Project fun fact",
      usage: "funfact",
      fn: () => "I built this MacOS UI using React — no external UI libraries."
    },
    easteregg: {
      description: "Hidden command",
      usage: "easteregg",
      fn: () => `👀 You found a hidden command!

Keep exploring... more features coming soon 🚀`
    }
  }), [changeWallpaper, changeWindowTheme, openWindow, setDesktopTheme])

  const welcomeMessage = `
╔════════════════════════════════════════╗
║     Welcome to My Portfolio CLI!       ║
╚════════════════════════════════════════╝

Type 'help' to see all available commands.

Try:
  • whoami
  • about
  • projects
  • open notes
  • open github
  • theme dark
  • clear
`

  return (
    <div className="terminal-app">
      <Terminal
        commands={commands}
        welcomeMessage={welcomeMessage}
        promptLabel="Meet:~$"
        promptLabelStyle={{ color: "#00ff00" }}
        ignoreCommandCase
      />
    </div>
  )
}

export default memo(TerminalApp)
