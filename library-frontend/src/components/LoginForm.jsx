import { useState, useEffect } from "react"
import { useMutation, useQuery } from '@apollo/client'
import { LOGIN, ME } from "../queries"

const LoginForm = ({ setToken, setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const userResult = useQuery(ME)
  

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      setUser(userResult.data)
      localStorage.setItem('user-token', token)
    }
  }, [result.data])

  const submit = (e) => {
    e.preventDefault()
    
    login({ variables: { username, password }})
  }

  return (
    <form onSubmit={submit}>
      <input value={ username } type="text" onChange={({ target }) => setUsername(target.value)}></input>
      <input value={ password } type="password" onChange={({ target }) => setPassword(target.value)}></input>
      <button type="submit">log in</button>
    </form>
  )
}

export default LoginForm