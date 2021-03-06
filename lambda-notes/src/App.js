// Libraries
import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import firebase from '../src/components/firebase';
import styled from 'styled-components';
import axios from 'axios';

// Components
import Sidebar from '../src/components/Sidebar'
import Content from '../src/components/Content'
import DeleteOverlay from './components/DeleteOverlay';
import {initialDataArr} from '../src/initialData';

// CSS
import './App.css';
import {bgColorPrimary, bgColorSecondary, borderColor} from '../src/components/css/Globals'

const MainContainer = styled.div`
  background-color: ${bgColorPrimary};
  border: 1px solid ${borderColor};
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  position:relative;
`

const SidebarStyled = styled(Col)`
  /* height:100vh; */
`
const ContentStyled = styled(Col)`
  background-color: ${bgColorSecondary};
  height:100%;
  border-left: 1px solid ${borderColor};
`

//Initialize a global reference to the RT DB on Firebase
const notesRef = firebase.database().ref('notes')

//Initialize back-end URL
const devBackEndURL = 'http://localhost:4000/notes'
const prodBackEndURL = 'https://lambda-notes-backside9.herokuapp.com/notes'
const url = prodBackEndURL;

class App extends Component {
  constructor(){
    super();
    this.state = {
      notes : [],
      deleteNote: {
        deleting:false,
        id:0,
      }
    }
  }
  
  componentDidMount(){
    //  ****  FIREBASE  ****
    // // Run this to initialize the database only runs once ever!!
    // this.initializeFireBaseData()

    // // Listen for changes to any value in the FB RT DB reference
    // notesRef.on('value', (snapshot) => {

    //   if (snapshot.val){
    //     // Since firebase stores object, we need to convert it to an array of object to work with our architecture
    //     let notes = Object.entries(snapshot.val()).map( entry => entry[1])

    //     //Set state shorthand, when the key name is the same as the name of the value variable
    //     this.setState({notes})  
    //   }

    // });


    //  ****  LOCAL SERVER   ****
    axios.get(url)
      .then(({data}) => {
        this.setState({notes:data})
      })
  }

  initializeFireBaseData = () => {
    initialDataArr.forEach(obj => {
      let noteKey = notesRef.push() // Blank slot waitin to be filled
      console.log(noteKey)
      noteKey.set({ // set the blank slot 
        id: noteKey.key, // access the key of the slot
        title:obj.title,
        tags:obj.tags,
        textBody:obj.textBody
      })
    })
  }

  saveNewNote = (noteTitle, noteTextBody) => {    
    //  ****  FIREBASE  ****
    // let newNoteInFB = notesRef.push()

    // let newNote = {
    //   "id": newNoteInFB.key,
    //   "tags": ["tag", "doctor4"],
    //   "title": noteTitle,
    //   "textBody":noteTextBody
    // }
    
    // newNoteInFB.set(newNote)


    //  ****  LOCAL SERVER   ****
    axios.post(url, {title:noteTitle, textBody:noteTextBody})
    .then(({data}) => {
      let notes = [...this.state.notes, data];
      this.setState({notes})
    })

  }

  editNote = (id, title, textBody) => {
    //  ****  FIREBASE  ****
    //Reference the id and then call update on the field, via shorthand
    // notesRef.child(id).update({title})
    // notesRef.child(id).update({textBody})

    //  ****  LOCAL SERVER   ****
    axios.post(`${url}/${id}`, {title, textBody})
    .then(({data}) => {
      let notes = [...this.state.notes].map(cv => {
        if (cv.id === data.id){
          cv.title = data.title;
          cv.textBody = data.textBody;
        }
        return cv
      })
      this.setState({notes})
    })
  }

  onDeleteLinkClick = (id) => {
    this.setState({
      deleteNote: {
        deleting:true,
        id:id,
      }
    })
  }

  deleteNoteClick = () => {
    //  ****  FIREBASE  ****
    // notesRef.child(this.state.deleteNote.id).remove()
    // this.deletingCompleted()


    //  ****  LOCAL SERVER   ****
    axios.delete(`${url}/${this.state.deleteNote.id}`)
    .then(({data}) => {
      let notes = [...this.state.notes].filter(cv => cv.id != this.state.deleteNote.id)
      this.setState({notes}, () => {
        this.deletingCompleted()
      })
    })
  }

  deletingCompleted = () =>{
    this.setState({
      deleteNote: {
        deleting:false,
        id:0,
      }
    })
  }

  render() {
    return (
      <React.Fragment>
        {(this.state.deleteNote.deleting) ? <DeleteOverlay deletingCompleted={this.deletingCompleted} deleteNoteClick={this.deleteNoteClick}/> : null}
      <MainContainer>
        <Container>
          <Row>
            <SidebarStyled md="3"><Sidebar/></SidebarStyled>
            <ContentStyled md="9">
              <Container>
                <Content notes={this.state.notes} saveNewNote={this.saveNewNote} editNote={this.editNote} onDeleteLinkClick={this.onDeleteLinkClick} />
              </Container>
            </ContentStyled>
          </Row>
        </Container>
      </MainContainer>
      </React.Fragment>
    );
  }
}

export default App;
