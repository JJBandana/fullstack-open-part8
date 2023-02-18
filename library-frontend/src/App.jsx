import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { useApolloClient, useSubscription } from "@apollo/client";
import Recomendations from "./components/Recomendations";
import "./components/Table.css"
import { BOOK_ADDED, ALL_BOOKS } from "./queries";

const App = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} by ${addedBook.author.name} has been added to the database`)
    }
  })

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const Navbar = () => {
    return (
      <div>
        <ul>
          <li>
            <Link to="/">Authors</Link>
          </li>
          <li>
            <Link to="/books">Books</Link>
          </li>

          {!token ? (
            <li>
              <Link to="/login">Login</Link>
            </li>
          ) : (
            <li>
              <Link to="/newbook">New Book</Link>
            </li>
          )}
          {token && (
            <li>
              <Link to="/recomendations">Recomendations</Link>
            </li>
          )}

          {token && (
            <li>
              <button onClick={logout}>LogOut</button>
            </li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginForm setToken={setToken} setUser={setUser} />} />
        <Route path="/" element={<Authors token={token} />} />
        <Route path="/books" element={<Books apolloClient={client} />} />
        <Route path="/newbook" element={<NewBook />} />
        <Route path="/recomendations" element={<Recomendations user={user} />} />
      </Routes>
    </div>
  );
};

export default App;
