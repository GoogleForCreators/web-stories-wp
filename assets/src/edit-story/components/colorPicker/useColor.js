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
import createSolid from '../../utils/createSolid';
import useReduction from './useReduction';
import insertStop from './insertStop';

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
          type,
          regenerate: false,
          currentColor: stops[0].color,
          currentStopIndex: 0,
          stops,
          angle,
        };

      case TYPE_RADIAL:
        return {
          ...state,
          type,
          regenerate: false,
          currentColor: stops[0].color,
          currentStopIndex: 0,
          stops,
          center,
          size,
        };

      case TYPE_CONIC:
        return {
          ...state,
          type,
          regenerate: false,
          currentColor: stops[0].color,
          currentStopIndex: 0,
          stops,
          angle,
          center,
        };

      case TYPE_SOLID:
      default:
        return {
          ...state,
          type: TYPE_SOLID,
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
  setToGradient: (state, { payload }) => {
    const stops = state.stops || [
      { color: state.currentColor, position: 0 },
      { color: state.currentColor, position: 1 },
    ];
    return {
      ...state,
      regenerate: true,
      type: payload,
      stops,
    };
  },
  addStopAt: (state, { payload: newPosition }) => {
    // If there's already a stop at this position, do nothing:
    if (state.stops.some(({ position }) => position === newPosition)) {
      return state;
    }

    const { index, color } = insertStop(state.stops, newPosition);

    const stops = [
      ...state.stops.slice(0, index),
      { color, position: newPosition },
      ...state.stops.slice(index),
    ];
    return {
      ...state,
      regenerate: true,
      currentColor: color,
      currentStopIndex: index,
      stops,
    };
  },
  moveCurrentStopTo: (state, { payload: newPosition }) => {
    const index = state.currentStopIndex;
    const stops = [
      ...state.stops.slice(0, index),
      { ...state.stops[index], position: newPosition },
      ...state.stops.slice(index + 1),
    ];

    // Sort by position
    stops.sort((a, b) => a.position - b.position);

    const currentStopIndex = stops.findIndex(
      ({ position }) => position === newPosition
    );

    return {
      ...state,
      regenerate: true,
      stops,
      currentStopIndex,
    };
  },
  removeCurrentStop: (state, {}) => {
    // Can't have less than two stops
    if (state.stops.length === 2) {
      return state;
    }
    const index = state.currentStopIndex;
    const stops = [...state.stops];
    stops.splice(index, 1);
    const currentStopIndex = index === stops.length ? index - 1 : index;

    return {
      ...state,
      regenerate: true,
      stops,
      currentColor: stops[currentStopIndex].color,
      currentStopIndex,
    };
  },
  updateCurrentColor: (state, { payload: { rgb } }) => {
    const currentColor = { ...rgb };
    const newState = {
      ...state,
      regenerate: true,
      currentColor,
    };

    if (state.type !== TYPE_SOLID) {
      // Also update color for current stop
      newState.stops = [
        ...state.stops.slice(0, state.currentStopIndex),
        {
          ...state.stops[state.currentStopIndex],
          color: currentColor,
        },
        ...state.stops.slice(state.currentStopIndex + 1),
      ];
    }

    return newState;
  },
  rotateClockwise: (state) => ({
    ...state,
    rotation: state.rotation + 0.25,
    regenerate: true,
  }),
  selectStop: (state, { payload: newIndex }) => {
    const currentStopIndex = Math.max(
      0,
      Math.min(state.stops.length - 1, newIndex)
    );
    const currentColor = state.stops[currentStopIndex].color;
    return {
      ...state,
      currentStopIndex,
      currentColor,
    };
  },
  reverseStops: (state) => {
    const stops = state.stops
      .map(({ color, position }) => ({ color, position: 1 - position }))
      .reverse();

    const currentStopIndex = stops.length - state.currentStopIndex - 1;

    return {
      ...state,
      stops,
      currentStopIndex,
      regenerate: true,
    };
  },
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
      return createSolid(r, g, b, a);
    }
    // TODO: generate minimal color representations for gradients
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
