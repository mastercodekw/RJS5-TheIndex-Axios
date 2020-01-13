import React, { Component } from "react";
import axios from "axios";
// import authors from "./data.js"

// Components
import Sidebar from "./Sidebar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";
import Loading from "./Loading";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";

class App extends Component {
  state = {
    authors: [],
    currentAuthor: null,
    loading: true
  };

  async componentDidMount() {
    try {
      const promise = await axios.get(
        "https://the-index-api.herokuapp.com/api/authors/"
      );

      const authors = promise.data;
      this.setState({ authors, loading: false });
    } catch (error) {
      console.error("Something went wrong!");
      console.error(error);
    }
  }

  selectAuthor = async author => {
    console.log("did select author with id: " + author.id);
    this.setState({ loading: true });
    try {
      const link = `https://the-index-api.herokuapp.com/api/authors/${author.id}/`;
      const promise = await axios.get(link);
      const authorDetail = promise.data;
      this.setState({ currentAuthor: authorDetail, loading: false });
    } catch (error) {
      console.error(error);
    }
  };

  unselectAuthor = () => this.setState({ currentAuthor: null });

  getContentView = () => {
    if (this.state.currentAuthor) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else {
      if (this.state.loading) {
        return <Loading />;
      } else {
        return (
          <AuthorsList
            authors={this.state.authors}
            selectAuthor={this.selectAuthor}
          />
        );
      }
    }
  };

  render() {
    console.log("Rendering with authors:\n" + this.state.authors);
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">{this.getContentView()}</div>
        </div>
      </div>
    );
  }
}

export default App;
