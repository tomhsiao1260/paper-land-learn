/* global cv */

import { useState, useEffect, useRef } from 'react'
import detectPrograms from './detectPrograms'

const videoStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '200px',
  height: '200px',
  transform: 'rotateY(180deg)',
  zIndex: 1,
}

const canvasStyle = {
  position: 'absolute',
  top: 0,
  left: '200px',
  width: '200px',
  height: '200px',
  transform: 'rotateY(180deg)',
  backgroundColor: 'red',
  zIndex: 2,
}

const defaultConfig = {
  paperSize: 'LETTER',
  colorsRGB: [[119, 43, 24, 255], [94, 104, 48, 255], [65, 80, 84, 255], [0, 0, 0, 255]],
  paperDotSizes: [8, 8, 8, 8],
  knobPoints: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }],
  showOverlayKeyPointCircles: true,
  showOverlayKeyPointText: true,
  showOverlayComponentLines: true,
  showOverlayShapeId: true,
  showOverlayProgram: true,
  autoPrintEnabled: false,
  freezeDetection: false,
  showPrintedInQueue: false,
  scaleFactor: 4,
};

function CameraVideo() {
  const videoInput = useRef(null)
  const canvasOutput = useRef(null)
  const [ videoStart, setVideoStart ] = useState(false)

  useEffect(async() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('No navigator.mediaDevices.getUserMedia exists.')
    }

    const contraints = {}
    contraints.video = {};
    contraints.video.width = 200
    contraints.video.height = 200

    const stream = await navigator.mediaDevices.getUserMedia(contraints)
    videoInput.current.srcObject = stream
    videoInput.current.width = 200
    videoInput.current.height = 200

    videoInput.current.onloadedmetadata = () => {
      videoInput.current.play()
      setVideoStart(true)
    }

    // const ctx = canvasOutput.current.getContext('2d')
    // canvasOutput.current.getContext('2d', { willReadFrequently: true })
  }, [])

  useEffect(() => {
    if (videoStart) {
      const dataToRemember = {}
      const videoCapture = new cv.VideoCapture(videoInput.current)
      processVideo(canvasOutput.current, videoCapture, dataToRemember, { config: defaultConfig })
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
