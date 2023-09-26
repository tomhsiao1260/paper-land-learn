import { useState, useEffect, useRef } from 'react'

function CameraVideo() {
  const videoInput = useRef(null)

  useEffect(async() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('No navigator.mediaDevices.getUserMedia exists.')
    }

    const contraints = {}
    contraints.video = {};
    contraints.video.width = 100
    contraints.video.height = 100

    const stream = await navigator.mediaDevices.getUserMedia(contraints)
    videoInput.current.srcObject = stream

    videoInput.current.onloadedmetadata = () => {
      videoInput.current.play()
    }
  }, [])

  return (
    <div>
      <video ref={ videoInput } />
    </div>
  )
}

export default CameraVideo
