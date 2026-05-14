import { memo } from "react"
import "./resume.scss"

const ResumeApp = () => {
  return (
    <div className="resume-app">
      <iframe src="/resume.pdf" frameBorder="0"></iframe>
    </div>
  )
}

export default memo(ResumeApp)
