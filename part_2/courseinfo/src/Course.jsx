const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ sum }) => <p><b>total of {sum} exercises</b></p>

const Part = ({ part }) =>
    <p>
        {part.name} {part.exercises}
    </p>

const Content = ({ parts }) => <> {parts.map(part => <Part key={part.id} part={part} />)} </>


const Course = ({ course, parts }) =>
    <div>
        <Header course={course} />
        <Content parts={parts} />
        <Total sum={parts.reduce((s, v) => s + v.exercises, 0)} />
    </div>


export default Course