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
import useReduction from './useReduction';

export const TYPE_SOLID = 'solid';
export const TYPE_LINEAR = 'linear';
export const TYPE_RADIAL = 'radial';
export const TYPE_CONIC = 'conic';

const initialState = {
  type: TYPE_SOLID,
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
  load: (state, { payload }) => ({
    ...state,
    /* TODO: Parse from any color string including gradients */
    currentColor: payload,
  }),
  setToSolid: (state) => ({
    ...state,
    type: TYPE_SOLID,
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
    const currentColor = `rgba(${Object.values(rgb).join(',')})`;
    const newState = {
      ...state,
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
    foo: payload,
    regenerate: true,
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

function useColor() {
  const [state, actions] = useReduction(initialState, reducer);

  const { currentColor } = state;

  // TODO: Generate color for gradients too
  const generatedColor = currentColor;

  return {
    state: {
      ...state,
      generatedColor,
    },
    actions,
  };
}

export default useColor;
