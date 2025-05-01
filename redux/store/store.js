// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import imageOverlayReducer from '../Slices/imageOverlaySlice';

export const store = configureStore({
  reducer: {
    imageOverlay: imageOverlayReducer
  }
});
