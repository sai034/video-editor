
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  url: null,
  position: { x: 0, y: 0 },
  opacity: 1
};

const imageOverlaySlice = createSlice({
  name: 'imageOverlay',
  initialState,
  reducers: {
    setImageOverlay(state, action) {
      state.url = action.payload.url;
    },
    setPosition(state, action) {
      state.position = action.payload;
    },
    setOpacity(state, action) {
      state.opacity = action.payload;
    }
  }
});

export const { setImageOverlay, setPosition, setOpacity } = imageOverlaySlice.actions;
export default imageOverlaySlice.reducer;
