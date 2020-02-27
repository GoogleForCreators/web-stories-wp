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
import { elementTypes } from '../../elements';
import BackgroundPanel from './background';
import ColorPanel from './color';
import BackgroundColorPanel from './backgroundColor';
import FontPanel from './font';
import MaskPanel from './mask';
import ScalePanel from './scale';
import StylePanel from './style';
import TextPanel from './text';
import VideoPosterPanel from './videoPoster';
import SizeAndPositionPanel from './sizeAndPosition';
export { default as LayerPanel } from './layer';
export { default as ColorPresetPanel } from './colorPreset';

const BACKGROUND = 'background';
const COLOR = 'color';
const SCALE = 'scale';
const FONT = 'font';
const TEXT = 'text';
const SIZE_AND_POSITION = 'sizeAndPosition';
const BACKGROUND_COLOR = 'backgroundColor';
const STYLE = 'style';
const VIDEO_POSTER = 'videoPoster';
const MASK = 'mask';

export const PanelTypes = {
  BACKGROUND,
  SCALE,
  BACKGROUND_COLOR,
  COLOR,
  FONT,
  SIZE_AND_POSITION,
  STYLE,
  TEXT,
  VIDEO_POSTER,
  MASK,
};

const ALL = Object.values(PanelTypes);

function intersect(a, b) {
  return a.filter((v) => b.includes(v));
}

export function getPanels(elements) {
  if (elements.length === 0) {
    return [];
  }

  const isBackground = elements.length === 1 && elements[0].isBackground;

  let selectionPanels = [];
  // Only display background panel in case of background element.
  if (isBackground) {
    selectionPanels = [{ type: BACKGROUND, Panel: BackgroundPanel }];
    // If the selected element's type is video, display poster panel, too.
    if ('video' === elements[0].type) {
      selectionPanels.push({ type: VIDEO_POSTER, Panel: VideoPosterPanel });
    }
  } else {
    // Find which panels all the selected elements have in common
    selectionPanels = elements
      .map(
        ({ type }) => elementTypes.find((elType) => elType.type === type).panels
      )
      .reduce((commonPanels, panels) => intersect(commonPanels, panels), ALL)
      .map((type) => {
        switch (type) {
          case BACKGROUND:
            // Only display for background element.
            return null;
          case SIZE_AND_POSITION:
            return { type, Panel: SizeAndPositionPanel };
          case SCALE:
            return { type, Panel: ScalePanel };
          case BACKGROUND_COLOR:
            return { type, Panel: BackgroundColorPanel };
          case COLOR:
            return { type, Panel: ColorPanel };
          case FONT:
            return { type, Panel: FontPanel };
          case STYLE:
            return { type, Panel: StylePanel };
          case TEXT:
            return { type, Panel: TextPanel };
          case VIDEO_POSTER:
            return { type, Panel: VideoPosterPanel };
          case MASK:
            return { type, Panel: MaskPanel };
          default:
            throw new Error(`Unknown panel: ${type}`);
        }
      })
      .filter((panel) => panel);
  }

  return selectionPanels;
}
