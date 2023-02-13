import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"
import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"

const Authors = () => {
  const result = useQuery(ALL_AUTHORS)
  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  
  const submit = (e) => {
    e.preventDefault()
    const update = {
      name: name,
      setBornTo: parseInt(born)
    }
    editAuthor({ variables: update})
  }
  
  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={submit}>

        <div>name
          <select onChange={({ target }) => setName(target.value)}>
            {result.data.allAuthors.map((a, i) => {
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

export default Authors