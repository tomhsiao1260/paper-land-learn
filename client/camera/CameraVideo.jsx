/* global cv */

import { useState, useEffect, useRef } from 'react'
import detectPrograms from './detectPrograms'

const videoStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '600px',
  height: '400px',
  transform: 'rotateY(180deg)',
  zIndex: 1,
}

const canvasStyle = {
  position: 'absolute',
  top: 0,
  left: '600px',
  width: '600px',
  height: '400px',
  transform: 'rotateY(180deg)',
  // backgroundColor: 'red',
  zIndex: 2,
}

function CameraVideo(props) {
  const videoInput = useRef(null)
  const canvasOutput = useRef(null)
  const [ videoStart, setVideoStart ] = useState(false)

  useEffect(async() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('No navigator.mediaDevices.getUserMedia exists.')
    }

    const contraints = {}
    contraints.video = {};
    contraints.video.width = 600
    contraints.video.height = 400

    const stream = await navigator.mediaDevices.getUserMedia(contraints)
    videoInput.current.srcObject = stream
    videoInput.current.width = 600
    videoInput.current.height = 400

    videoInput.current.onloadedmetadata = () => {
      videoInput.current.play()
      setVideoStart(true)
    }
  }, [])

  useEffect(() => {
    if (videoStart) {
      const dataToRemember = {}
      const videoCapture = new cv.VideoCapture(videoInput.current)
      processVideo(canvasOutput.current, videoCapture, dataToRemember, { config: props.config })
    }
  }, [videoStart])

  return (
    <div>
      <video style={ videoStyle } ref={ videoInput } />
      <canvas style={ canvasStyle } ref={ canvasOutput } />
    </div>
  )
}

function processVideo(canvas, videoCapture, dataToRemember, props) {
  if (props.config.freezeDetection) return;

    const displayMat = new cv.Mat(
      videoCapture.video.height,
      videoCapture.video.width,
      cv.CV_8UC4
    );

    try {
      const { programsToRender, markers, keyPoints, dataToRemember: data, framerate } = detectPrograms({
        config: props.config,
        videoCapture,
        dataToRemember,
        displayMat,
        scaleFactor: props.config.scaleFactor,
        allBlobsAreKeyPoints: false,
        debugPrograms: [],
        // debugPrograms: this.props.debugPrograms,
      });

      setTimeout(() => processVideo(canvas, videoCapture, data, props));
    } catch (error) {
      console.log(error); // eslint-disable-line no-console
    }

    cv.imshow(canvas, displayMat);
    displayMat.delete();
}

export default CameraVideo
