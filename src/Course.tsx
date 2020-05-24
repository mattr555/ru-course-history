import React from "react"
import { scaleLinear } from "d3-scale"

interface Props {
  course: ICourse
  terms: string[]
}

export interface ICourse {
  cid: string
  title: string
  terms: any
}

const termNumbers: any = {
  "0": "Winter",
  "1": "Spring",
  "7": "Summer",
  "9": "Fall",
}

function Course({ terms, course }: Props) {
  const max = Math.max(...terms.map((t) => (course.terms[t] as number) || 0))
  var scale: (n: number) => string
  if (max === 1) {
    scale = (n: number) => "green"
  } else {
    scale = scaleLinear<string>().domain([1, max]).range(["#bfdfbf", "green"])
  }

  const termBars = terms.map((t) => {
    let color = "white"
    let sections = "No sections"
    if (t in course.terms) {
      if (course.terms[t] > 0) {
        color = scale(course.terms[t] as number)
        sections = `${course.terms[t]} section${course.terms[t] > 1 ? "s" : ""}`
      } else {
        color = "gray"
        sections = "Different course title"
      }
    }

    const term = `${termNumbers[t[0]]} ${t.substr(1)}`

    return {
      tip: `${term}<br/>${sections}`,
      color,
      width: t[0] === "0" || t[0] === "7" ? 20 : 50,
      marginRight: t[0] === "1" ? 10 : 1,
    }
  })

  return (
    <div className="course">
      <div>
        <span className="courseTitle">
          {course.cid}: {course.title}
        </span>
      </div>
      <div>
        {termBars.map(({ tip, color, width, marginRight }) => {
          return (
            <div
              className="termIndicator"
              data-tip={tip}
              style={{
                backgroundColor: color,
                width,
                marginRight,
              }}
            ></div>
          )
        })}
      </div>
    </div>
  )
}

export default Course
