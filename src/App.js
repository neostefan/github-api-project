import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom' 

// let obj = {
//   repoName: res.data.full_name,
//   createdAt: res.data.createdAt,
//   languages: res.data.language
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<IndexPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

function IndexPage() {

  const [repos, setRepos] = useState([]);

  useEffect(() => {
    axios.defaults.baseURL = "https://api.github.com"
    axios.get('/users/cocoyellow/repos').then(res => {
      setRepos(res.data)
    }).catch(err => {
      console.log(err)
    })
  }, [])

  return(
    <div className='page'>
      <div className='profile'>
        Hi, I'm Israel Albright Chigozirim.
        Front End Developer and Designer.
      </div>
      { repos.map((repo) => (
        <ListRepoComponent repo={repo} key={repo.id}/>
      ))}
    </div>
  )
}

function ListRepoComponent({ repo }) {
  return (
    <div className='repo-component-card'>
      <div className='title'>
        { repo.full_name }
      </div>
      <div className='divider'></div>
      <div className='body'>
        <div>{repo.createdAt}</div>
        <div>{repo.language}</div>
      </div>
    </div>
  )
}