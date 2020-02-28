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
import PageBackgroundPanel from './pageBackground';
import BackgroundColorPanel from './backgroundColor';
import FillPanel from './fill';
import MaskPanel from './mask';
import RotationPanel from './rotationAngle';
import SizePanel from './size';
import PositionPanel from './position';
import ScalePanel from './scale';
import StylePanel from './textStyle';
import TextPanel from './text';
import VideoPosterPanel from './videoPoster';
import NoSelectionPanel from './noSelection';
export { default as LayerPanel } from './layer';
export { default as ColorPresetPanel } from './colorPreset';

const BACKGROUND = 'background';
const SCALE = 'scale';
const ROTATION_ANGLE = 'rotationAngle';
const TEXT = 'text';
const SIZE = 'size';
const POSITION = 'position';
const FILL = 'fill';
const BACKGROUND_COLOR = 'backgroundColor';
const STYLE = 'style';
const VIDEO_POSTER = 'videoPoster';
const MASK = 'mask';
const PAGE = 'page';
const NO_SELECTION = 'noselection';

export const PanelTypes = {
  BACKGROUND,
  POSITION,
  SIZE,
  SCALE,
  BACKGROUND_COLOR,
  STYLE,
  TEXT,
  ROTATION_ANGLE,
  FILL,
  VIDEO_POSTER,
  MASK,
};

const ALL = Object.values(PanelTypes);

function intersect(a, b) {
  return a.filter((v) => b.includes(v));
}

export function getPanels(elements) {
  if (elements.length === 0) {
    return [
      { type: PAGE, Panel: PageBackgroundPanel },
      { type: NO_SELECTION, Panel: NoSelectionPanel },
    ];
  }

  const isBackground = elements.length === 1 && elements[0].isBackground;

  // Only display background panel in case of background element.
  if (isBackground) {
    const panels = [
      { type: PAGE, Panel: PageBackgroundPanel },
      { type: BACKGROUND, Panel: BackgroundPanel },
    ];
    // If the selected element's type is video, display poster panel, too.
    if ('video' === elements[0].type) {
      panels.push({ type: VIDEO_POSTER, Panel: VideoPosterPanel });
    }
    return panels;
  }

  // Find which panels all the selected elements have in common
  return elements
    .map(
      ({ type }) => elementTypes.find((elType) => elType.type === type).panels
    )
    .reduce((commonPanels, panels) => intersect(commonPanels, panels), ALL)
    .map((type) => {
      switch (type) {
        case BACKGROUND:
          // @todo Would be good to have a general logic for panels supporting multi-selection instead.
          // Only display when one element selected.
          if (1 === elements.length) {
            return { type, Panel: BackgroundPanel };
          }
          return null;
        case POSITION:
          return { type, Panel: PositionPanel };
        case SCALE:
          return { type, Panel: ScalePanel };
        case ROTATION_ANGLE:
          return { type, Panel: RotationPanel };
        case SIZE:
          return { type, Panel: SizePanel };
        case FILL:
          return { type, Panel: FillPanel };
        case BACKGROUND_COLOR:
          return { type, Panel: BackgroundColorPanel };
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
