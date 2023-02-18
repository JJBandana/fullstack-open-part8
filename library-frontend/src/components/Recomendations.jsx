import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"

const Recomendations = ({ user }) => {
  const { data, loading, error } = useQuery(ALL_BOOKS, { variables: { genre: user.me.favouriteGenre} })

  if (loading) return <div>Loading...</div>

  if (error) return <div>Something gone wrong</div>


  return(
    <div>
      <h2>Recomendations</h2>
      <p>books in your favourite genre patterns</p>
      <table>
        <thead> 
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          { data.allBooks.map((book, i) => {
            return(          
              <tr key={i}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            )
          })
          }
        </tbody>
      </table>
    </div>
  )
}

export default Recomendations