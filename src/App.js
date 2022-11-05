import "./App.css";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useSearchParams,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/repository" element={<RepositoryPage />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

function IndexPage() {
  let [repos, setRepos] = useState([]);
  let [page, setPage] = useState(1);
  let [totalPages, setTotalPages] = useState(0);
  let [error, setError] = useState(null);

  let goToNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
    console.log(page);
  };

  let goToPrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
    console.log(page);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let res = await fetch(`https://api.github.com/users/cocoyellow/repos`);

        if (!res) {
          throw Error("unable to get response from api");
        }

        let data = await res.json();

        if (!data) {
          throw Error("unable to parse json data");
        }

        const indexOfLastRepo = page * 3;
        const indexOfFirstRepo = indexOfLastRepo - 3;
        setTotalPages(Math.ceil(data.length / 3));
        setRepos(data.slice(indexOfFirstRepo, indexOfLastRepo));
      } catch (e) {
        setError(e);
      }
    }

    fetchData();
  }, [page]);

  return (
    <div className="page">
      <div className="profile">
        <img className="profile_img"></img>
        <div className="profile_desc">
          Hi, I'm Israel Albright Chigozirim. Front End Developer and Designer.
        </div>
      </div>
      {error !== null ? (
        <div className="error">{error.message}</div>
      ) : (
        <div className="section-repo">
          <div className="title">Repositories</div>
          <div className="body">
            {repos.map((repo) => (
              <ListRepoComponent repo={repo} key={repo.id} />
            ))}
          </div>
          <PaginationComponent goToNext={goToNext} goToPrev={goToPrev} />
        </div>
      )}
    </div>
  );
}

function RepositoryPage() {
  let [searchParams] = useSearchParams();
  let [repo, setRepo] = useState(null);
  let [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let res = await fetch(
          "https://api.github.com/repos/" + searchParams.get("repo_name")
        );
        if (!res) {
          throw Error("unable to fetch repository information");
        }

        let data = await res.json();

        if (!data) {
          throw Error("unable to parse repository data");
        }

        setRepo(data);
        console.log(data);
      } catch (e) {
        setError(e);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="repo-detail">
      {error !== null ? <div className="error">{error.message}</div> : null}
      {repo && error !== null ? (
        <RepoDetailsComponent repo={repo} />
      ) : (
        <span className="loading_text">Fetching Repository Data...</span>
      )}
    </div>
  );
}

function ListRepoComponent({ repo }) {
  let date = new Date(repo.created_at);
  let fmtDate = date.toISOString().substring(0, 10);
  return (
    <Link
      to={`/repository?repo_name=${repo.full_name}`}
      style={{ textDecoration: "none" }}
    >
      <div className="repo-component-card">
        <div className="title">{repo.full_name}</div>
        <div className="body">
          <div className="repo_date">{fmtDate}</div>
          <div className="repo_language">{repo.language}</div>
        </div>
      </div>
    </Link>
  );
}

function RepoDetailsComponent({ repo }) {
  let cDate = new Date(repo.created_at);
  let uDate = new Date(repo.updated_at);
  let fmtcDate = cDate.toISOString().substring(0, 10);
  let fmtuDate = uDate.toISOString().substring(0, 10);

  return (
    <div className="repo_detail_card">
      <div className="repo_detail_card_title">{repo.full_name}</div>
      <div className="repo_detail_card_body">
        <div className="watchers">Watchers: {repo.watchers_count}</div>
        <div className="forks">Forks: {repo.forks_count}</div>
        <div className="created_at">Created At: {fmtcDate}</div>
        <div className="last_updated">Last Updated: {fmtuDate}</div>
        <div className="desc">
          <div className="desc-title">Description</div>
          <div className="desc-text">{repo.description}</div>
        </div>
      </div>
    </div>
  );
}

function PaginationComponent({ goToPrev, goToNext }) {
  return (
    <div className="pagination">
      <button className="prev" onClick={goToPrev}>
        Prev
      </button>
      <button className="next" onClick={goToNext}>
        Next
      </button>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error: error.message,
    };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({
      hasError: true,
      error: error.toString(),
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div className="error">Something went wrong.</div>;
    }

    return this.props.children;
  }
}
