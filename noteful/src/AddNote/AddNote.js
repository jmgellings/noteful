import React, {Component} from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import './AddNote.css'
import moment from 'moment';

export default class AddNote extends Component {
  constructor() {
    super();
    this.state = {
      showingAlert: false
    }
    this.timeoutId = 0;
  }

  static defaultProps = {
    onAddNote: () => {}
  }

  static contextType = ApiContext;

  displayConfirmation() {
    this.setState({
      showingAlert: true
    });

    setTimeout(() => {
      this.setState({
        showingAlert: false
      });
    }, 2000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  handleClickAddNote(event) {
    event.preventDefault();
    const noteName = event.target.newNoteName.value;
    const selectedFolder = event.target.folderSelection.value; 
    const noteContent = event.target.noteContent.value;

    fetch(`${config.API_ENDPOINT}/notes/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        name: `${noteName}`,
        modified: `${moment().format()}`,
        folderId: `${selectedFolder}`,
        content: `${noteContent}`
      })
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .then((newNote) => {
        this.context.addNote(newNote)
      })
      .then(this.displayConfirmation())
      .catch(error => {
        console.error({ error })
      })
  }

  render() {
    const folders = this.context.folders;
    let foldersList = folders.map(folder => {
      return(<option key={folder.id} value={folder.id}>{folder.name}</option>)
    })

    return(
      <div className="AddNote">
        <form className="Note__form" onSubmit={e => this.handleClickAddNote(e)}>
          <div className="form_input">
            <label htmlFor="newNoteName">New Note Name: </label>
            <input type="text" name="newNoteName" id="newNoteName" required></input>
          </div>
          <div className="form_input">
            <label htmlFor="folderSelection">Choose a folder: </label>
            <select id="folderSelection">
              {foldersList}
            </select>
          </div>
          <div className="form_input content_input" >
            <label htmlFor="noteContent">What should the note say?</label>
            <textarea name="noteContent" id="noteContent" required></textarea>
          </div>
          <button type="submit">Add note</button>
        </form>

        <div className={`alert alert-success ${this.state.showingAlert ? 'alert-shown' : 'alert-hidden'}`}>
          <strong>Success!</strong> Note added!
        </div>
      </div>
    )
  }
}