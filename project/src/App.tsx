import Date from "./components/date/date.tsx"
import Covers from "./components/covers/covers.tsx"
import Comments from "./components/comments/comments.tsx"
import './App.css'

function App() {
  return (
    <>
      <Date />
      <div id="covers">
        <Covers />
        <Covers />
        <Covers />
      </div>
      <Comments />
    </>
  )
}

export default App
