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
import { elementTypes } from '../../../elements';
import {
  AnimationPanel,
  BackgroundSizePositionPanel,
  BackgroundOverlayPanel,
  BorderRadiusPanel,
  BorderStylePanel,
  CaptionsPanel,
  ImageAccessibilityPanel,
  LinkPanel,
  LayerStylePanel,
  PageAttachmentPanel,
  PageStylePanel,
  ShapeStylePanel,
  SizePositionPanel,
  TextStylePanel,
  VideoAccessibilityPanel,
  NoSelectionPanel,
  ElementAlignmentPanel,
  VideoOptionsPanel,
  VideoPosterPanel,
  StylePresetPanel,
  ColorPresetPanel,
} from '../../panels/design';
import PanelTypes from '../../panels/design/types';

const ALL = Object.values(PanelTypes);

function intersect(a, b) {
  return a.filter((v) => b.includes(v));
}

function getDesignPanelsForSelection(elements) {
  if (elements.length === 0) {
    return [{ type: PanelTypes.NO_SELECTION, Panel: NoSelectionPanel }];
  }

  const isBackground = elements.length === 1 && elements[0].isBackground;

  // Only display background panel in case of background element.
  if (isBackground) {
    const panels = [
      { type: PanelTypes.PAGE_ATTACHMENT, Panel: PageAttachmentPanel },
    ];

    const isBackgroundMedia = !elements[0].isDefaultBackground;
    if (isBackgroundMedia) {
      panels.push({
        type: PanelTypes.BACKGROUND_SIZE_POSITION,
        Panel: BackgroundSizePositionPanel,
      });
      panels.push({
        type: PanelTypes.BACKGROUND_OVERLAY,
        Panel: BackgroundOverlayPanel,
      });
      panels.push({ type: PanelTypes.ANIMATION, Panel: AnimationPanel });
    }

    // If the selected element's type is video / image , display accessibility panel, too.
    if ('video' === elements[0].type) {
      panels.push({ type: PanelTypes.VIDEO_OPTIONS, Panel: VideoOptionsPanel });
      panels.push({
        type: PanelTypes.CAPTIONS,
        Panel: CaptionsPanel,
      });
      panels.push({
        type: PanelTypes.VIDEO_ACCESSIBILITY,
        Panel: VideoAccessibilityPanel,
      });
    } else if (['gif', 'image'].includes(elements[0].type)) {
      panels.push({
        type: PanelTypes.IMAGE_ACCESSIBILITY,
        Panel: ImageAccessibilityPanel,
      });
      // In case of default background without media:
    } else {
      panels.unshift({ type: PanelTypes.PAGE_STYLE, Panel: PageStylePanel });
      // Always display Presets as the first panel for background.
      panels.unshift({
        type: PanelTypes.STYLE_PRESETS,
        Panel: ColorPresetPanel,
      });
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
        case PanelTypes.ANIMATION:
          return { type, Panel: AnimationPanel };
        case PanelTypes.BACKGROUND_SIZE_POSITION:
          // Only display when isBackground.
          return null;
        case PanelTypes.COLOR_PRESETS:
          return { type, Panel: ColorPresetPanel };
        case PanelTypes.STYLE_PRESETS:
          return { type, Panel: StylePresetPanel };
        case PanelTypes.LAYER_STYLE:
          return { type, Panel: LayerStylePanel };
        case PanelTypes.BACKGROUND_OVERLAY:
          // Only display when isBackground.
          return null;
        case PanelTypes.SIZE_POSITION:
          return { type, Panel: SizePositionPanel };
        case PanelTypes.LINK:
          return { type, Panel: LinkPanel };
        case PanelTypes.TEXT_STYLE:
          return { type, Panel: TextStylePanel };
        case PanelTypes.SHAPE_STYLE:
          return { type, Panel: ShapeStylePanel };
        case PanelTypes.BORDER_RADIUS:
          return { type, Panel: BorderRadiusPanel };
        case PanelTypes.BORDER:
          return { type, Panel: BorderStylePanel };
        case PanelTypes.VIDEO_OPTIONS:
          return { type, Panel: VideoOptionsPanel };
        case PanelTypes.VIDEO_POSTER:
          return { type, Panel: VideoPosterPanel };
        case PanelTypes.CAPTIONS:
          return { type, Panel: CaptionsPanel };
        case PanelTypes.VIDEO_ACCESSIBILITY:
          return { type, Panel: VideoAccessibilityPanel };
        case PanelTypes.IMAGE_ACCESSIBILITY:
          return { type, Panel: ImageAccessibilityPanel };
        case PanelTypes.ELEMENT_ALIGNMENT:
          return { type, Panel: ElementAlignmentPanel };
        default:
          throw new Error(`Unknown panel: ${type}`);
      }
    })
    .filter((panel) => panel);
}

export default getDesignPanelsForSelection;
