const Course = (props) => {
  return (
    <>
      <Header name={props.course.name} />
      <Content parts={props.course.parts} />
    </>
  )
}

const Header = (props) => {
  return <h1>{props.name}</h1>
}

const Part = (props) => {
  console.log(props)
  return (
    <li id={props.id}>
      {props.name} {props.exercises}
    </li>
  )
}

const Content = (props) => {
  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {props.parts.map(part =>
        <Part name={part.name} exercises={part.exercises} id={part.id} />
      )}
      <Total parts={props.parts} />
    </ul>
  )
}

const Total = (props) => {
  const total = props.parts.reduce( (totalExercises, part) => {
    return totalExercises + part.exercises
  }, 0)
  return (
    <li style={{ fontWeight: 'bold' }}>
      total of {total} exercises
    </li>
  )
}

export default Course