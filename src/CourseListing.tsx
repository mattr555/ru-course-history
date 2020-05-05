import React, { useEffect, useState } from "react"
import ReactTooltip from "react-tooltip"
import Course, { ICourse } from "./Course"

interface Props {
  subjectId: string
  terms: string[]
  showGrad: boolean
}

interface Subject {
  sid: string
  name: string
  courses: ICourse[]
}

function CourseListing({ subjectId, terms, showGrad }: Props) {
  const [subject, setSubject] = useState<Subject | null>(null)

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + `/data/${subjectId}.json`)
      .then((resp) => resp.json())
      .then((subject) => setSubject(subject))
  }, [subjectId])

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [subject, terms, showGrad])

  const renderedCourses =
    subject &&
    subject.courses
      .filter((i) => i.cid[7] < "5" || showGrad)
      .map((i) => <Course course={i} terms={terms} />)

  if (!subject) {
    return <span>Loading...</span>
  } else if (!renderedCourses || renderedCourses.length === 0) {
    return <span>No courses available (they may be filtered)</span>
  }

  return (
    <div>
      <h2>Courses in {subject.name}</h2>
      {renderedCourses}
    </div>
  )
}

export default CourseListing
