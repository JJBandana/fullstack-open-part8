import { useState } from "react"
import { useMutation } from "@apollo/client"
import { EDIT_AUTHOR, ALL_AUTHORS } from "../queries"

const BornForm = ({ data }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const submit = (e) => {
    e.preventDefault()
    const update = {
      name: name,
      setBornTo: parseInt(born)
    }
    editAuthor({ variables: update})
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>

        <div>name
          <select onChange={({ target }) => setName(target.value)}>
            {data.allAuthors.map((a, i) => {
              return (
                <option key={i} value={a.name}>{a.name}</option>
              )
            })}
          </select>
        </div>

        <div>born<input value={born} onChange={({ target }) => setBorn(target.value)}/></div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default BornForm