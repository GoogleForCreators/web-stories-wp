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
import { ANIMATION_EFFECTS, DIRECTION } from '../../../../animation';

export const GRID_ITEM_HEIGHT = 64;
export const PANEL_WIDTH = 276;

export const animations = [
  { targets: ['drop'], type: ANIMATION_EFFECTS.DROP },
  { targets: ['fade-in'], type: ANIMATION_EFFECTS.FADE_IN },
  {
    targets: ['fly-in-bottom'],
    type: ANIMATION_EFFECTS.FLY_IN,
    flyInDir: DIRECTION.BOTTOM_TO_TOP,
  },
  {
    targets: ['fly-in-top'],
    type: ANIMATION_EFFECTS.FLY_IN,
    flyInDir: DIRECTION.TOP_TO_BOTTOM,
  },
  {
    targets: ['fly-in-left'],
    type: ANIMATION_EFFECTS.FLY_IN,
    flyInDir: DIRECTION.LEFT_TO_RIGHT,
  },
  {
    targets: ['fly-in-right'],
    type: ANIMATION_EFFECTS.FLY_IN,
    flyInDir: DIRECTION.RIGHT_TO_LEFT,
  },
  {
    targets: ['pulse'],
    type: ANIMATION_EFFECTS.PULSE,
  },
  {
    targets: ['rotate-left'],
    type: ANIMATION_EFFECTS.ROTATE_IN,
    rotateInDir: DIRECTION.LEFT_TO_RIGHT,
  },
  {
    targets: ['rotate-right'],
    type: ANIMATION_EFFECTS.ROTATE_IN,
    rotateInDir: DIRECTION.RIGHT_TO_LEFT,
  },
];

export const elements = [
  {
    id: 'drop',
    x: 0,
    y: 0,
    height: GRID_ITEM_HEIGHT,
  },
  {
    id: 'fade-in',
    x: 0,
    y: 0,
    height: GRID_ITEM_HEIGHT,
  },
  {
    id: 'fly-in-bottom',
    x: 0,
    y: 0,
    height: GRID_ITEM_HEIGHT,
    width: 58,
  },
  {
    id: 'fly-in-top',
    x: 0,
    y: 0,
    height: GRID_ITEM_HEIGHT,
    width: 58,
  },
  {
    id: 'fly-in-left',
    x: 0,
    y: 0,
    height: GRID_ITEM_HEIGHT,
    width: 58,
  },
  {
    id: 'fly-in-right',
    x: 0,
    y: 0,
    height: GRID_ITEM_HEIGHT,
    width: 58,
  },
  {
    id: 'pulse',
    x: 0,
    y: 0,
    height: GRID_ITEM_HEIGHT,
  },
  {
    id: 'rotate-left',
    x: 0,
    y: 0,
    height: GRID_ITEM_HEIGHT,
  },
  {
    id: 'rotate-right',
    x: 0,
    y: 0,
    height: GRID_ITEM_HEIGHT,
  },
];
