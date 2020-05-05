import React, { useEffect, useState } from "react"
import Select, { ValueType } from "react-select"
import CourseListing from "./CourseListing"
import "./App.css"
import ReactTooltip from "react-tooltip"
import Modal from "./Modal"

interface Subject {
  id: string
  name: string
}

interface Option {
  value: string
  label: string
}

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selected, setSelected] = useState<ValueType<Option>>(undefined)
  const [winterSummer, setWinterSummer] = useState(false)
  const [grad, setGrad] = useState(false)
  const [modal, setModal] = useState(
    () => (window.localStorage.getItem("disclaimed") || "false") === "false"
  )

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data/subjects.json")
      .then((resp) => resp.json())
      .then((subjects) => setSubjects(subjects))
  }, [])

  useEffect(() => {
    window.localStorage.setItem("disclaimed", String(!modal))
  }, [modal])

  const options = subjects.map((i) => ({
    value: i.id,
    label: `${i.name} (${i.id})`,
  }))

  let terms: string[] = []
  for (var year = 2015; year < 2021; year++) {
    let semesters = ["1", "9"]
    if (winterSummer) {
      semesters = ["0", "1", "7", "9"]
    }
    if (year === 2015) {
      semesters = winterSummer ? ["7", "9"] : ["9"]
    }
    terms = terms.concat(semesters.map((i) => `${i}${year}`))
  }

  return (
    <div className="App">
      <div className="topBar">
        <div className="search">
          <Select
            value={selected}
            onChange={(val) => setSelected(val)}
            options={options}
          />
        </div>
        <div className="options">
          <input
            type="checkbox"
            checked={winterSummer}
            onChange={() => setWinterSummer(!winterSummer)}
          />{" "}
          Show Winter/Summer
          <input
            type="checkbox"
            checked={grad}
            onChange={() => setGrad(!grad)}
          />{" "}
          Show Graduate
          <button style={{ marginLeft: 5 }} onClick={() => setModal(!modal)}>
            Disclaimer
          </button>
        </div>
      </div>
      <div className="spacer"></div>
      <div className="results">
        {(selected && (
          <CourseListing
            subjectId={(selected as Option).value}
            terms={terms}
            showGrad={grad}
          />
        )) || <div>Select a subject!</div>}
      </div>
      <ReactTooltip effect="solid" html={true} />
      {modal && <Modal onDismiss={() => setModal(!modal)} />}
    </div>
  )
}

export default App
