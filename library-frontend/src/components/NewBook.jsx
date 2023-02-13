import { useState } from 'react'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from '../queries'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [publishedString, setPublishedString] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS}, { query: ALL_BOOKS}]
  })
  const navigate = useNavigate()


  const submit = (event) => {
    event.preventDefault()
    const published = parseInt(publishedString)

    createBook({ variables: { title, author, published, genres}})

    console.log('add book...')

    setTitle('')
    setPublishedString('')
    setAuthor('')
    setGenres([])
    setGenre('')

    navigate('/books', { replace: true })
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={publishedString}
            onChange={({ target }) => setPublishedString(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook