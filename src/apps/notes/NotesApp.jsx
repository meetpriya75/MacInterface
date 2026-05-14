import { memo, useEffect, useState } from "react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { atelierDuneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"
import "./notes.scss"

const NotesApp = () => {
  const [markdown, setMarkdown] = useState(null)

  useEffect(() => {
    let isMounted = true

    fetch("/note.txt")
      .then(res => res.text())
      .then(text => {
        if (isMounted) {
          setMarkdown(text)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="notes-app">
      {markdown
        ? <SyntaxHighlighter language="typescript" style={atelierDuneDark}>{markdown}</SyntaxHighlighter>
        : <p>Loading...</p>}
    </div>
  )
}

export default memo(NotesApp)
