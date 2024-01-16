import { useState, useEffect } from 'react'
import axios from 'axios'


const Filter = ({ handleFilterChange, filter }) => <div>Filter: <input value={filter} onChange={handleFilterChange} /></div>

const PersonForm = ({ addPerson, handleNameChange, newName, handleNumberChange, newNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const Persons = ({ persons, filter }) => {
  return (
    <ul>
      {persons.reduce(
        (list_array, person) => {
          if (person.name.toLowerCase().includes(filter.toLowerCase())) {
            list_array.push(<li key={person.name}>{person.name} {person.number}</li>)
          }
          return list_array
        },
        []
      )
      }
    </ul>
  )
}



const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')


  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }


  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.reduce((found, person) => found || person.name === newName, false)) {
      alert(`${newName} is already added to phonebook!`)
    }
    else {
      const personObj = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObj))
      setNewName("")
      setNewNumber("")
    }

  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter handleFilterChange={handleFilterChange} filter={filter} />
      <h2>Add new contact</h2>
      <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} newName={newName} handleNumberChange={handleNumberChange} newNumber={newNumber} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </div>
  )
}

export default App