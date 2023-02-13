import { Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { gql } from '@apollo/client'

const App = () => {

  const Navbar = () => {

    return(
      <div>
        <ul>
          <li>
        <Link to="/">Authors</Link>
          </li>
          <li>
        <Link to="/books">Books</Link>
          </li>
          <li>
        <Link to="/newbook">New Book</Link>
          </li>
        </ul>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/newbook" element={<NewBook />} />
      </Routes>
    </div>
  )
}

export default App
