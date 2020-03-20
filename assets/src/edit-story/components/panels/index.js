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
import PageBackgroundPanel from './pageBackground';
import BackgroundSizePositionPanel from './backgroundSizePosition';
import BackgroundOverlayPanel from './backgroundOverlay';
import LinkPanel from './link';
import LayerStylePanel from './layerStyle';
import SizePositionPanel from './sizePosition';
import TextStylePanel from './textStyle';
import VideoPosterPanel from './videoPoster';
import BackgroundDisplayPanel from './backgroundDisplay';
import NoSelectionPanel from './noSelection';
export { default as LayerPanel } from './layer';
export { default as ColorPresetPanel } from './colorPreset';
export { default as PublishPanel } from './publish';

const BACKGROUND_SIZE_POSITION = 'backgroundSizePosition';
const BACKGROUND_DISPLAY = 'backgroundDisplay';
const BACKGROUND_OVERLAY = 'backgroundOverlay';
const LAYER_STYLE = 'layerStyle';
const LINK = 'link';
const TEXT = 'text';
const SIZE_POSITION = 'sizePosition';
const STYLE = 'style';
const TEXT_STYLE = 'textStyle';
const VIDEO_POSTER = 'videoPoster';
const PAGE = 'page';
const NO_SELECTION = 'noselection';

export const PanelTypes = {
  BACKGROUND_SIZE_POSITION,
  BACKGROUND_DISPLAY,
  BACKGROUND_OVERLAY,
  SIZE_POSITION,
  STYLE,
  LAYER_STYLE,
  TEXT,
  TEXT_STYLE,
  LINK,
  VIDEO_POSTER,
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
      { type: BACKGROUND_SIZE_POSITION, Panel: BackgroundSizePositionPanel },
      { type: LAYER_STYLE, Panel: LayerStylePanel },
      { type: BACKGROUND_DISPLAY, Panel: BackgroundDisplayPanel },
      { type: BACKGROUND_OVERLAY, Panel: BackgroundOverlayPanel },
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
        case BACKGROUND_SIZE_POSITION:
          // Only display when isBackround.
          return null;
        case LAYER_STYLE:
          return { type, Panel: LayerStylePanel };
        case BACKGROUND_DISPLAY:
          // Only display when isBackground.
          return null;
        case BACKGROUND_OVERLAY:
          // Only display when isBackground.
          return null;
        case SIZE_POSITION:
          return { type, Panel: SizePositionPanel };
        case LINK:
          return { type, Panel: LinkPanel };
        case TEXT_STYLE:
          return { type, Panel: TextStylePanel };
        case VIDEO_POSTER:
          return { type, Panel: VideoPosterPanel };
        default:
          throw new Error(`Unknown panel: ${type}`);
      }
    })
    .filter((panel) => panel);
}
