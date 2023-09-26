import React from 'react'
import ReactDOM from 'react-dom'
import ProjectorMain from './ProjectorMain'

const root = document.getElementById('root');
document.body.appendChild(root);

function render() {
  ReactDOM.render(
    <ProjectorMain />
    , root
  )
}
render();
