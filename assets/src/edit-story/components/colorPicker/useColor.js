/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import useReduction from '../../utils/useReduction';

export const TYPE_SOLID = 'solid';
export const TYPE_LINEAR = 'linear';
export const TYPE_RADIAL = 'radial';
export const TYPE_CONIC = 'conic';

const initialState = {
  type: TYPE_SOLID,
  regenerate: false,
  stops: [],
  currentColor: {
    r: 0,
    g: 0,
    b: 0,
    a: 0,
  },
  currentStopIndex: 0,
  angle: 0,
  center: [],
  size: [],
};

const reducer = {
  load: (state, { payload }) => {
    const { type, color, stops, angle, center, size } = payload;
    switch (type) {
      case TYPE_LINEAR:
        return {
          ...state,
          regenerate: false,
          color: stops[0].color,
          stops,
          angle,
        };

      case TYPE_RADIAL:
        return {
          ...state,
          regenerate: false,
          color: stops[0].color,
          stops,
          center,
          size,
        };

      case TYPE_CONIC:
        return {
          ...state,
          regenerate: false,
          color: stops[0].color,
          stops,
          angle,
          center,
        };

      case TYPE_SOLID:
      default:
        return {
          ...state,
          regenerate: false,
          currentColor: color,
        };
    }
  },
  setToSolid: (state) => ({
    ...state,
    type: TYPE_SOLID,
    regenerate: true,
  }),
  setToGradient: (state, { payload }) => ({
    ...state,
    type: payload,
  }),
  addStopAt: (state, { payload }) => ({
    ...state,
    foo: payload,
  }),
  moveCurrentStopTo: (state, { payload }) => ({
    ...state,
    foo: payload,
  }),
  updateCurrentColor: (state, { payload: { rgb } }) => {
    const currentColor = { ...rgb };
    const newState = {
      ...state,
      regenerate: true,
      currentColor,
    };

    if (state.type !== TYPE_SOLID) {
      // Also update color for current stop
      state.stops = [
        state.stops.slice(0, state.currentStopIndex),
        {
          ...state.stop[state.currentStopIndex],
          color: currentColor,
        },
        state.stops.slice(state.currentStopIndex + 1),
      ];
    }

    return newState;
  },
  rotateClockwise: (state) => ({
    ...state,
    angle: state.angle + 90,
    regenerate: true,
  }),
  selectStop: (state, { payload }) => ({
    ...state,
    currentStopIndex: payload,
  }),
  deleteStop: (state, { payload: indexToDelete }) => ({
    ...state,
    stops: state.stops.filter((stop, index) => index !== indexToDelete),
    regenerate: true,
  }),
  reverseStops: (state) => ({
    ...state,
    stops: [...state.stops].reverse(),
    regenerate: true,
  }),
};

function regenerateColor(pattern) {
  const { regenerate, type } = pattern;
  if (!regenerate) {
    return null;
  }

  switch (type) {
    case TYPE_SOLID: {
      const {
        currentColor: { r, g, b, a },
      } = pattern;
      const minColor = a === 1 ? { r, g, b } : { r, g, b, a };
      return { color: minColor };
    }
    default:
      return null;
  }
}

function useColor() {
  const [state, actions] = useReduction(initialState, reducer);

  const generatedColor = regenerateColor(state);

  return {
    state: {
      ...state,
      generatedColor,
    },
    actions,
  };
}

export default useColor;
