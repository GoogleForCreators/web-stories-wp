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
import insertStop from './insertStop';
import regenerateColor from './regenerateColor';
import { TYPE_SOLID, TYPE_LINEAR, TYPE_RADIAL } from './constants';

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
  rotation: 0.5,
  alpha: 1,
  center: { x: 0.5, y: 0.5 },
  size: { w: 1, h: 1 },
};

const reducer = {
  load: (state, { payload }) => {
    const { type, color, stops, rotation, center, size, alpha } = payload;
    const shouldReset =
      type &&
      type !== TYPE_SOLID &&
      (state.type !== type || stops?.length !== state.stops?.length);
    const maybeReset = shouldReset
      ? { currentColor: stops[0].color, currentStopIndex: 0 }
      : {};
    switch (type) {
      case TYPE_LINEAR:
        return {
          ...state,
          ...maybeReset,
          type,
          regenerate: false,
          stops,
          alpha: isNaN(alpha) ? state.alpha : alpha,
          rotation: isNaN(rotation) ? 0 : rotation, // explicitly default to 0 here!
        };

      case TYPE_RADIAL:
        return {
          ...state,
          ...maybeReset,
          type,
          regenerate: false,
          stops,
          center: typeof center !== 'undefined' ? center : state.center,
          size: typeof size !== 'undefined' ? size : state.size,
          alpha: isNaN(alpha) ? state.alpha : alpha,
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
    const stops =
      state.stops && state.stops.length >= 2
        ? state.stops
        : [
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
  moveCurrentStopBy: (state, { payload: deltaPosition }) => {
    const index = state.currentStopIndex;
    const currentPosition = state.stops[index].position;
    // Clamp by 0 and 1, round to 4 decimals
    const desiredPosition = Math.max(
      0,
      Math.min(1, Number((currentPosition + deltaPosition).toFixed(4)))
    );
    if (desiredPosition === currentPosition) {
      return state;
    }
    const stops = [
      ...state.stops.slice(0, index),
      {
        ...state.stops[index],
        position: desiredPosition,
      },
      ...state.stops.slice(index + 1),
    ];

    // Sort by position
    stops.sort((a, b) => a.position - b.position);

    const currentStopIndex = stops.findIndex(
      ({ position }) => position === desiredPosition
    );

    return {
      ...state,
      regenerate: true,
      stops,
      currentStopIndex,
    };
  },
  removeCurrentStop: (state) => {
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
    rotation: (state.rotation + 0.25) % 1,
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
