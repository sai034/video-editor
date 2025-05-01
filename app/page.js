'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import {
  setImageOverlay,
  setPosition,
  setOpacity
} from '../redux/Slices/imageOverlaySlice';

export default function Home() {
  const [video, setVideo] = useState(null);
  const [editedVideoUrl, setEditedVideoUrl] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [processing, setProcessing] = useState(false);

  const [subtitleText, setSubtitleText] = useState('');
  const [subtitleStart, setSubtitleStart] = useState('');
  const [subtitleEnd, setSubtitleEnd] = useState('');
  const [subtitles, setSubtitles] = useState([]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');

  const dispatch = useDispatch();
  const { url: image, position: imagePosition, opacity: imageOpacity } = useSelector(
    (state) => state.imageOverlay
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'video/*': [] },
    onDrop: (acceptedFiles) => {
      setVideo(acceptedFiles[0]);
      setEditedVideoUrl(null);
    }
  });


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
  
    dispatch(setImageOverlay({ url }));
  };
  
  const handleAddSubtitle = () => {
    const start = parseFloat(subtitleStart);
    const end = parseFloat(subtitleEnd);

    if (!subtitleText || isNaN(start) || isNaN(end) || start >= end) {
      alert('Invalid subtitle or time range.');
      return;
    }

    setSubtitles([...subtitles, { text: subtitleText, start, end }]);
    setSubtitleText('');
    setSubtitleStart('');
    setSubtitleEnd('');
  };

  const handleEdit = async () => {
    if (!video || !startTime || !endTime) return alert('Fill all fields!');

    setProcessing(true);
    const videoFile = URL.createObjectURL(video);
    const videoElement = document.createElement('video');
    videoElement.src = videoFile;

    videoElement.onloadedmetadata = async () => {
      const startTimeSec = parseFloat(startTime);
      const endTimeSec = parseFloat(endTime);
      const duration = videoElement.duration;

      if (startTimeSec >= duration || endTimeSec > duration || startTimeSec >= endTimeSec) {
        alert('Invalid time range!');
        setProcessing(false);
        return;
      }

      const stream = videoElement.captureStream();
      const mediaRecorder = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const editedUrl = URL.createObjectURL(blob);
        setEditedVideoUrl(editedUrl);
        setProcessing(false);
      };

      mediaRecorder.start();
      videoElement.currentTime = startTimeSec;

      videoElement.ontimeupdate = () => {
        if (videoElement.currentTime >= endTimeSec) {
          mediaRecorder.stop();
          videoElement.pause();
        }
      };

      videoElement.play();
    };
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">CSS Video Editor</h1>

      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-400 p-6 rounded cursor-pointer mb-4 bg-gray-800"
      >
        <input {...getInputProps()} />
        <p>{video ? video.name : 'Drag and drop a video here or click to select one'}</p>
      </div>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="p-2 bg-gray-700 rounded"
          placeholder="Start time (in seconds)"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <input
          className="p-2 bg-gray-700 rounded"
          placeholder="End time (in seconds)"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </div>

      {/* Subtitle Section */}
      <div className="mt-6 bg-gray-800 p-4 rounded">
        <h2 className="text-xl mb-2 font-semibold">Add Subtitle</h2>
        <input
          className="p-2 bg-gray-700 rounded w-full mb-2"
          placeholder="Subtitle Text"
          value={subtitleText}
          onChange={(e) => setSubtitleText(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            className="p-2 bg-gray-700 rounded"
            placeholder="Start Time"
            value={subtitleStart}
            onChange={(e) => setSubtitleStart(e.target.value)}
          />
          <input
            className="p-2 bg-gray-700 rounded"
            placeholder="End Time"
            value={subtitleEnd}
            onChange={(e) => setSubtitleEnd(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddSubtitle}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
        >
          Add Subtitle
        </button>

        {subtitles.length > 0 && (
          <ul className="mt-4 text-sm text-gray-300 space-y-1">
            {subtitles.map((s, idx) => (
              <li key={idx}>
                <strong>{s.start} - {s.end}s:</strong> {s.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Image Upload Section */}
      <div className="mt-6 bg-gray-800 p-4 rounded">
        <h2 className="text-xl mb-2 font-semibold">Upload Image for Overlay</h2>
        <input type="file" className="block w-full bg-gray-700 rounded p-2" onChange={handleImageUpload} />
        <div className="mt-4">
          <label className="block mb-2 text-sm">Position</label>
          <input
            className="p-2 bg-gray-700 rounded mb-2"
            placeholder="X Position"
            type="number"
            value={imagePosition.x}
            onChange={(e) => dispatch(setPosition({ ...imagePosition, x: e.target.value }))}
          />
          <input
            className="p-2 bg-gray-700 rounded mb-2"
            placeholder="Y Position"
            type="number"
            value={imagePosition.y}
            onChange={(e) => dispatch(setPosition({ ...imagePosition, y: e.target.value }))}
          />
          <label className="block mb-2 text-sm">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={imageOpacity}
            onChange={(e) => dispatch(setOpacity(parseFloat(e.target.value)))}
            className="w-full"
          />
        </div>
      </div>

      <button
        className="mt-6 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleEdit}
        disabled={processing || !video}
      >
        {processing ? 'Processing...' : 'Edit & Download'}
      </button>

      {editedVideoUrl && (
        <div className="mt-6 relative">
          <video
            src={editedVideoUrl}
            controls
             className="w-full h-auto max-h-[70vh] rounded shadow"
            onTimeUpdate={(e) => {
              const current = e.target.currentTime;
              const active = subtitles.find(s => current >= s.start && current <= s.end);
              setCurrentSubtitle(active?.text || '');
            }}
          />
          {currentSubtitle && (
            <div className="absolute bottom-12 left-0 right-0 text-center">
              <span className="bg-black bg-opacity-70 text-white px-4 py-1 rounded text-sm">
                {currentSubtitle}
              </span>
            </div>
          )}
          {image && (
            <div
              className="absolute"
              style={{
                top: `${imagePosition.y}px`,
                left: `${imagePosition.x}px`,
                opacity: imageOpacity
              }}
            >
              <img src={image} alt="Overlay" className="w-[60%] h-[50%]" />
            </div>
          )}
          <a
            href={editedVideoUrl}
            download="edited-video.webm"
            className="mt-4 inline-block bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Download Edited Video
          </a>
        </div>
      )}
    </main>
  );
}
