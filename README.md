# Video Editor Application

A simple, browser-based video editor that allows users to upload videos, trim them, add subtitles, and overlay images. Built with **React**, **Redux**, and **Next.js**, this application provides an easy-to-use interface for video editing directly in the web browser.

## Features

- **Upload Video**: Drag and drop or select video files to upload.
- **Trim Video**: Define start and end time to trim the video.
- **Add Subtitles**: Add subtitles at specific times in the video.
- **Image Overlay**: Upload an image and position it anywhere on the video with adjustable opacity.
- **Download Edited Video**: Once edits are done, download the final video with all changes applied.

## Technologies Used

- **React**: For building the user interface.
- **Next.js**: Framework for server-side rendering and routing.
- **Redux**: State management for handling video data and UI state.
- **React Dropzone**: File upload functionality for video and image files.
- **Tailwind CSS**: Utility-first CSS framework for fast UI development.
- **MediaRecorder API**: Used for capturing and processing video streams in the browser.

## How to Run Locally

### Prerequisites

Before running the project locally, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (for managing dependencies)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/sai034/video-editor.git
   cd video-editor

2. **Install dependencies:**

Using npm:

```bash
npm install
