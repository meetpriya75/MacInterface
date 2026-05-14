import { memo } from "react"
import DateTime from "../../components/DateTime"
import "./calendar.scss"

const CalendarApp = () => {
  return (
    <div className="calendar-app">
      <div className="calendar-panel">
        <p className="label">Today</p>
        <h1><DateTime /></h1>
        <button
          type="button"
          onClick={() => window.open("https://calendar.google.com/calendar/u/0/r?tab=mc&pli=1", "_blank")}
        >
          Open Google Calendar
        </button>
      </div>
    </div>
  )
}

export default memo(CalendarApp)
