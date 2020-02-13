import React, {Component} from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddFolder.css'

export default class AddFolder extends Component {
  constructor() {
    super();
    this.state = {
      showingAlert: false
    }
    this.timeoutId = 0;
  }

  static defaultProps = {
    onAddFolder: () => {},
  }

  static contextType = ApiContext;

  displayConfirmation() {
    this.setState({
      showingAlert: true
    });

    this.timeoutId = setTimeout(() => {
      this.setState({
        showingAlert: false
      });
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  handleClickAddFolder(event) {
    event.preventDefault();
    const folderToAdd = event.target.newFolderName.value;

    fetch(`${config.API_ENDPOINT}/folders/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({name: `${folderToAdd}`})
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then((newFolder) => {
        this.context.addFolder(newFolder)
      })
      .then(this.displayConfirmation())
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    return(
      <div className="AddFolder">
        <form className="Folder__form" onSubmit={e => this.handleClickAddFolder(e)}>
          <label htmlFor="newFolderName">New Folder Name: </label>
          <input name="newFolderName" id="newFolderName"></input>
          <button type="submit">Add folder</button>
        </form>

        <div className={`alert alert-success ${this.state.showingAlert ? 'alert-shown' : 'alert-hidden'}`}>
          <strong>Success!</strong> Folder added!
        </div>
      </div>
    )
  }
}