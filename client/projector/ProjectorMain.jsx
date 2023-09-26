/* global cv */

import { useState, useEffect, useRef } from 'react'

const videoStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  transform: 'rotateY(180deg)',
  zIndex: 1,
}

function ProjectorMain(props) {
  const videoInput = useRef(null)
  const [ videoStart, setVideoStart ] = useState(false)

  useEffect(async() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('No navigator.mediaDevices.getUserMedia exists.')
    }

    const contraints = {}
    contraints.video = {};
    contraints.video.width = window.innerWidth
    contraints.video.height = window.innerHeight

    const stream = await navigator.mediaDevices.getUserMedia(contraints)
    videoInput.current.srcObject = stream
    videoInput.current.width = window.innerWidth
    videoInput.current.height = window.innerHeight

    videoInput.current.onloadedmetadata = () => {
      videoInput.current.play()
      setVideoStart(true)
    }
  }, [])

  return (
    <div>
      <video style={ videoStyle } ref={ videoInput } />
    </div>
  )
}

export default ProjectorMain;
