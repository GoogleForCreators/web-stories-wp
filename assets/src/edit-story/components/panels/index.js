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
import BackgroundSizePositionPanel from './backgroundSizePosition';
import BackgroundOverlayPanel from './backgroundOverlay';
import ImageAccessibilityPanel from './imageAccessibility';
import LinkPanel from './link';
import LayerStylePanel from './layerStyle';
import PageStylePanel from './pageStyle';
import ShapeStylePanel from './shapeStyle';
import SizePositionPanel from './sizePosition';
import TextStylePanel from './textStyle';
import VideoAccessibilityPanel from './videoAccessibility';
import NoSelectionPanel from './noSelection';
import ElementAlignmentPanel from './alignment';
import VideoOptionsPanel from './videoOptions';
import StylePresetPanel from './stylePreset';
export { default as LayerPanel } from './layer';

const BACKGROUND_SIZE_POSITION = 'backgroundSizePosition';
const BACKGROUND_OVERLAY = 'backgroundOverlay';
const STYLE_PRESETS = 'stylePresets';
const IMAGE_ACCESSIBILITY = 'imageAccessibility';
const LAYER_STYLE = 'layerStyle';
const LINK = 'link';
const PAGE_STYLE = 'pageStyle';
const SIZE_POSITION = 'sizePosition';
const SHAPE_STYLE = 'shapeStyle';
const TEXT = 'text';
const TEXT_STYLE = 'textStyle';
const VIDEO_OPTIONS = 'videoOptions';
const VIDEO_ACCESSIBILITY = 'videoAccessibility';
const ELEMENT_ALIGNMENT = 'elementAlignment';
const NO_SELECTION = 'noselection';

export const PanelTypes = {
  STYLE_PRESETS, // Display presets as the first panel for elements.
  ELEMENT_ALIGNMENT,
  PAGE_STYLE,
  BACKGROUND_SIZE_POSITION,
  BACKGROUND_OVERLAY,
  SIZE_POSITION,
  SHAPE_STYLE,
  LAYER_STYLE,
  TEXT,
  TEXT_STYLE,
  LINK,
  VIDEO_OPTIONS,
  IMAGE_ACCESSIBILITY,
  VIDEO_ACCESSIBILITY,
};

const ALL = Object.values(PanelTypes);

function intersect(a, b) {
  return a.filter((v) => b.includes(v));
}

export function getPanels(elements) {
  if (elements.length === 0) {
    return [{ type: NO_SELECTION, Panel: NoSelectionPanel }];
  }

  const isBackground = elements.length === 1 && elements[0].isBackground;

  // Only display background panel in case of background element.
  if (isBackground) {
    const panels = [{ type: PAGE_STYLE, Panel: PageStylePanel }];

    if (!elements[0].isDefaultBackground) {
      panels.push({
        type: BACKGROUND_SIZE_POSITION,
        Panel: BackgroundSizePositionPanel,
      });
      panels.push({ type: BACKGROUND_OVERLAY, Panel: BackgroundOverlayPanel });
    }

    // If the selected element's type is video / image , display accessibility panel, too.
    if ('video' === elements[0].type) {
      panels.push({ type: VIDEO_OPTIONS, Panel: VideoOptionsPanel });
      panels.push({
        type: VIDEO_ACCESSIBILITY,
        Panel: VideoAccessibilityPanel,
      });
    } else if ('image' === elements[0].type) {
      panels.push({
        type: IMAGE_ACCESSIBILITY,
        Panel: ImageAccessibilityPanel,
      });
    }
    // Always display Presets as the first panel for background.
    panels.unshift({ type: STYLE_PRESETS, Panel: StylePresetPanel });
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
          // Only display when isBackground.
          return null;
        case STYLE_PRESETS:
          return { type, Panel: StylePresetPanel };
        case LAYER_STYLE:
          return { type, Panel: LayerStylePanel };
        case BACKGROUND_OVERLAY:
          // Only display when isBackground.
          return null;
        case SIZE_POSITION:
          return { type, Panel: SizePositionPanel };
        case LINK:
          return { type, Panel: LinkPanel };
        case TEXT_STYLE:
          return { type, Panel: TextStylePanel };
        case SHAPE_STYLE:
          return { type, Panel: ShapeStylePanel };
        case VIDEO_OPTIONS:
          return { type, Panel: VideoOptionsPanel };
        case VIDEO_ACCESSIBILITY:
          return { type, Panel: VideoAccessibilityPanel };
        case IMAGE_ACCESSIBILITY:
          return { type, Panel: ImageAccessibilityPanel };
        case ELEMENT_ALIGNMENT:
          return { type, Panel: ElementAlignmentPanel };
        default:
          throw new Error(`Unknown panel: ${type}`);
      }
    })
    .filter((panel) => panel);
}
