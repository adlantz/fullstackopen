import { useState, useEffect } from 'react'
import personService from './services/persons'


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




const Persons = ({ persons, filter, removePerson }) => {
  return (
    <ul>
      {persons.reduce(
        (list_array, person) => {
          if (person.name.toLowerCase().includes(filter.toLowerCase())) {
            list_array.push(<li key={person.id}>{person.name} {person.number} <button onClick={() => removePerson(person.id, person.name)}>delete</button></li>)
          }
          return list_array
        },
        []
      )
      }
    </ul>
  )
}

const SuccessNotification = ({ message, isError }) => {



  if (!message) {
    return null
  }

  const successStyle = {
    color: isError ? 'red' : 'green',
    background: 'lightgrey',
    fontStyle: 'solid',
    fontSize: 20,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return (
    <div style={successStyle}>
      {message}
    </div>
  )
}



const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')

  const [successMessage, setSuccessMessage] = useState(null)
  const [isError, setIsError] = useState(false)


  useEffect(() => {
    personService.getAll().then(initialPersons => setPersons(initialPersons))
  }, [])

  const removePerson = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      personService.remove(id).then(deletedPerson => {
        setPersons(persons.filter(person => person.id !== deletedPerson.id))
      })
    }
  }

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
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const personObj = { ...existingPerson, number: newNumber }
      if (window.confirm(`${newName} is already in the phonebook. Would you like to update their number?`)) {
        personService.update(existingPerson.id, personObj).then(updatedPerson => {
          setPersons(persons.map(person => person.id === updatedPerson.id ? updatedPerson : person))
        }).catch(error => {
          setIsError(true)
          setSuccessMessage(`Information of ${existingPerson.name} has been removed from phonebook.`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)

        })
        setNewName("")
        setNewNumber("")
      }
    }
    else {
      const personObj = {
        name: newName,
        number: newNumber
      }
      personService.create(personObj).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setIsError(false)
        setSuccessMessage(`Successfully added ${returnedPerson.name} to phonebook!`)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
        setNewName("")
        setNewNumber("")
      }
      )


    }

  }

  return (
    <div>
      <h1>Phonebook</h1>
      <SuccessNotification message={successMessage} isError={isError} />
      <Filter handleFilterChange={handleFilterChange} filter={filter} />
      <h2>Add new contact</h2>
      <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} newName={newName} handleNumberChange={handleNumberChange} newNumber={newNumber} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} removePerson={removePerson} />
    </div>
  )
}

export default App