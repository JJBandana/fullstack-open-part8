import { useQuery, useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { ALL_BOOKS } from "../queries";

const Books = () => {
  const result = useQuery(ALL_BOOKS);
  const [getBooks, byGenreResult] = useLazyQuery(ALL_BOOKS, {
    fetchPolicy: "no-cache",
  });
  const [genre, setGenre] = useState("all");
  const [books, setBooks] = useState(null);

  useEffect(() => {
    if (result.data) {
      setBooks(result.data.allBooks);
    }
  }, [result.data]);

  useEffect(() => {
    if (byGenreResult.data) {
      setBooks(byGenreResult.data.allBooks);
    }
  }, [byGenreResult.data]);

  if (!books) {
    return null;
  }

  if (result.loading || byGenreResult.loading) {
    return <div>Loading...</div>;
  }
  if (result.error || byGenreResult.error) {
    return <div>Something gone wrong</div>;
  }

  const { allBooks } = result.data;

  const genres = [...new Set(allBooks.flatMap((book) => book.genres))].concat(
    "all"
  );

  const handleFilter = (genre) => {
    console.log(genre)
    setGenre(genre);

    if (genre === "all") {
      setBooks(allBooks);
      return;
    }

    getBooks({ variables: { genre: genre } });
  };

  return (
    <div>
      <h2>books</h2>
      <h3>sorting by {genre} genre</h3>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map((genre) => (
          <button key={genre} onClick={() => handleFilter(genre)}>
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
