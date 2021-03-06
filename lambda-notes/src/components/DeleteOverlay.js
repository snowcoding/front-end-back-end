// Libraries
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// CSS
import {borderColor, accentColorPrimary, overlayColor, warningColor } from '../components/css/Globals'

const Overlay = styled.div`
  background: ${overlayColor};
  
  /* max-width: 900px; */
  width: 100%;
  margin: 0 auto;
  /* position:relative; */

  height: 100vh;
  /* width: 117vh; */
  position: fixed;
  opacity: 0.95;
  overflow: hidden;
  /* display: none; */
  z-index: 10;
`

const DeleteDialog = styled.div`
  top:22%;
  left:32%;
  background-color:white;
  position: fixed;
  height:23%;
  width:35%;
  z-index: 20;
  border: 1px solid ${borderColor};
`
const Title = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 1.5rem;
  width: 100%;
  text-align: center;
  padding:7%;
`

const BaseButton = styled.button`
  font-family: 'Roboto', sans-serif;
  background-color: ${accentColorPrimary};
  border: 1px solid ${borderColor};
  height: 40px;
  color: white;
  text-align:center;
  width:36%;
  font-size: 1.5rem;
  margin-left:4%;
  &:hover{
    cursor: pointer;
  }
`

const DelButton = styled.button`
  font-family: 'Roboto', sans-serif;
  background-color: ${warningColor};
  border: 1px solid ${borderColor};
  height: 40px;
  color: white;
  text-align:center;
  width:35.5%;
  font-size: 1.5rem;
  margin-left:14%;
  &:hover{
    cursor: pointer;
  }
`

const DeleteOverlay = (props) => {
  return (
    <div>
      <Overlay />
      <DeleteDialog> 
        <Title>Are you sure you want to delete this note?</Title>
        
        <Link to="/view-notes"><DelButton onClick={props.deleteNoteClick}>Delete</DelButton></Link>
        <BaseButton onClick={props.deletingCompleted}>No</BaseButton>
      </DeleteDialog>
    </div>
  );
};

export default DeleteOverlay;