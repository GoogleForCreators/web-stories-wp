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
import StylePanel from './style';
import PageBackgroundPanel from './pageBackground';
import FillPanel from './fill';
import FontPanel from './font';
import LinkPanel from './link';
import MaskPanel from './mask';
import SizePositionPanel from './sizePosition';
import ScalePanel from './scale';
import TextStylePanel from './textStyle';
import TextPanel from './text';
import VideoPosterPanel from './videoPoster';
import BackgroundDisplayPanel from './backgroundDisplay';
import NoSelectionPanel from './noSelection';
export { default as LayerPanel } from './layer';
export { default as ColorPresetPanel } from './colorPreset';

const BACKGROUND = 'background';
const BACKGROUND_DISPLAY = 'backgroundDisplay';
const COLOR = 'color';
const SCALE = 'scale';
const FONT = 'font';
const LINK = 'link';
const TEXT = 'text';
const SIZE_POSITION = 'sizePosition';
const FILL = 'fill';
const STYLE = 'style';
const TEXT_STYLE = 'textStyle';
const VIDEO_POSTER = 'videoPoster';
const MASK = 'mask';
const PAGE = 'page';
const NO_SELECTION = 'noselection';

export const PanelTypes = {
  BACKGROUND,
  BACKGROUND_DISPLAY,
  SIZE_POSITION,
  SCALE,
  COLOR,
  FONT,
  STYLE,
  TEXT,
  TEXT_STYLE,
  LINK,
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
      { type: BACKGROUND_DISPLAY, Panel: BackgroundDisplayPanel },
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
        case BACKGROUND_DISPLAY:
          // Only display when isBackground.
          return null;
        case SCALE:
          return { type, Panel: ScalePanel };
        case SIZE_POSITION:
          return { type, Panel: SizePositionPanel };
        case FILL:
          return { type, Panel: FillPanel };
        case COLOR:
          return { type, Panel: ColorPanel };
        case FONT:
          return { type, Panel: FontPanel };
        case STYLE:
          return { type, Panel: StylePanel };
        case TEXT:
          return { type, Panel: TextPanel };
        case LINK:
          return { type, Panel: LinkPanel };
        case TEXT_STYLE:
          return { type, Panel: TextStylePanel };
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
