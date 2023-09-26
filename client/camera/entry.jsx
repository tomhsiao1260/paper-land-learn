import React from 'react'
import ReactDOM from 'react-dom'
import CameraMain from './CameraMain'

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

function sanitizeConfig(config) {
  const newConfig = { ...config };
  if (newConfig.colorsRGB.length !== defaultConfig.colorsRGB.length)
    newConfig.colorsRGB = defaultConfig.colorsRGB;

  if (!newConfig.paperDotSizes) {
    newConfig.paperDotSizes = defaultConfig.paperDotSizes;
  }
  return newConfig;
}

localStorage.paperProgramsConfig = JSON.stringify(
  sanitizeConfig({
    ...defaultConfig,
    ...JSON.parse(localStorage.paperProgramsConfig || '{}'),
  })
);

if (!localStorage.hasOwnProperty('paperProgramsProgramsToRender')) {
  localStorage.paperProgramsProgramsToRender = JSON.stringify([]);
}

if (!localStorage.hasOwnProperty('paperProgramsMarkers')) {
  localStorage.paperProgramsMarkers = JSON.stringify([]);
}

const root = document.getElementById('root');
document.body.appendChild(root);

function render() {
  ReactDOM.render(
    <CameraMain
      config={JSON.parse(localStorage.paperProgramsConfig)}
    />
    , root
  )
}
render();
