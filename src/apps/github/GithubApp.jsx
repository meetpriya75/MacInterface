import { memo } from "react"
import githubData from "../../assets/github.json"
import "./github.scss"

const GitCard = ({ data = { id: 1, image: "", title: "", description: "", tags: [], repoLink: "", demoLink: "" } }) => {
  return (
    <div className="card">
      <img src={data.image} alt="" />
      <h1>{data.title}</h1>
      <p className="description">{data.description}</p>

      <div className="tags">
        {data.tags.map(tag => <p key={tag} className="tag">{tag}</p>)}
      </div>

      <div className="urls">
        <a href={data.repoLink}>Repository</a>
        {data.demoLink && <a href={data.demoLink}>Demo Link</a>}
      </div>
    </div>
  )
}

const MemoizedGitCard = memo(GitCard)

const GithubApp = () => {
  return (
    <div className="cards">
      {githubData.map(project => {
        return <MemoizedGitCard key={project.id} data={project} />
      })}
    </div>
  )
}

export default memo(GithubApp)
