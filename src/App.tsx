import React, { useEffect, useState } from "react"
import Select, { ValueType } from "react-select"
import CourseListing from "./CourseListing"
import "./App.css"
import ReactTooltip from "react-tooltip"
import Modal from "./Modal"

interface Index {
  subjects: Subject[]
  availableTerms: string[]
}

interface Subject {
  id: string
  name: string
}

interface Option {
  value: string
  label: string
}

function App() {
  const [index, setIndex] = useState<Index>()
  const [selected, setSelected] = useState<ValueType<Option>>(undefined)
  const [winterSummer, setWinterSummer] = useState(false)
  const [grad, setGrad] = useState(false)
  const [modal, setModal] = useState(
    () => (window.localStorage.getItem("disclaimed") || "false") === "false"
  )

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data/index.json")
      .then((resp) => resp.json())
      .then((index) => setIndex(index))
  }, [])

  useEffect(() => {
    window.localStorage.setItem("disclaimed", String(!modal))
  }, [modal])

  const options = index?.subjects.map((i) => ({
    value: i.id,
    label: `${i.name} (${i.id})`,
  }))

  let terms = winterSummer
    ? index?.availableTerms
    : index?.availableTerms.filter(
        (i) => i.startsWith("1") || i.startsWith("9")
      )

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
          <label>
            <input
              type="checkbox"
              checked={winterSummer}
              onChange={() => setWinterSummer(!winterSummer)}
            />{" "}
            Show Winter/Summer
          </label>
          <label>
            <input
              type="checkbox"
              checked={grad}
              onChange={() => setGrad(!grad)}
            />{" "}
            Show Graduate
          </label>
          <button style={{ marginLeft: 5 }} onClick={() => setModal(!modal)}>
            Disclaimer
          </button>
        </div>
      </div>
      <div className="spacer"></div>
      <div className="results">
        {(terms && selected && (
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
