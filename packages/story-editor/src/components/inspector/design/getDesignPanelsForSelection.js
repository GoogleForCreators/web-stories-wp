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
 * External dependencies
 */
import { PanelTypes } from '@googleforcreators/design-system';
import { elementTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import {
  AnimationPanel,
  BorderStylePanel,
  CaptionsPanel,
  FilterPanel,
  ImageAccessibilityPanel,
  LinkPanel,
  PageAttachmentPanel,
  PageBackgroundPanel,
  ShapeStylePanel,
  SizePositionPanel,
  TextStylePanel,
  VideoAccessibilityPanel,
  ElementAlignmentPanel,
  VideoOptionsPanel,
  PageBackgroundAudioPanel,
} from '../../panels/design';

const ALL = Object.values(PanelTypes);

function intersect(a, b) {
  return a.filter((v) => b.includes(v));
}

function getDesignPanelsForSelection(elements) {
  if (elements.length === 0) {
    return [];
  }

  const isBackground = elements.length === 1 && elements[0].isBackground;

  // Only display background panel in case of background element.
  if (isBackground) {
    const panels = [];

    const isBackgroundMedia = !elements[0].isDefaultBackground;
    if (isBackgroundMedia) {
      panels.push({
        type: PanelTypes.PAGE_BACKGROUND,
        Panel: PageBackgroundPanel,
      });
      panels.push({
        type: PanelTypes.FILTER,
        Panel: FilterPanel,
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
      panels.unshift({
        type: PanelTypes.PAGE_BACKGROUND,
        Panel: PageBackgroundPanel,
      });
    }

    panels.push({
      type: PanelTypes.PAGE_ATTACHMENT,
      Panel: PageAttachmentPanel,
    });

    panels.push({
      type: PanelTypes.PAGE_BACKGROUND_AUDIO,
      Panel: PageBackgroundAudioPanel,
    });

    return panels;
  }

  // Find which panels all the selected elements have in common
  return elements
    .map(({ type }) => elementTypes[type].panels)
    .reduce((commonPanels, panels) => intersect(commonPanels, panels), ALL)
    .map((type) => {
      switch (type) {
        case PanelTypes.ANIMATION:
          return { type, Panel: AnimationPanel };
        case PanelTypes.PAGE_BACKGROUND:
          // Only display when isBackground.
          return null;
        case PanelTypes.FILTER:
          return { type, Panel: FilterPanel };
        case PanelTypes.SIZE_POSITION:
          return { type, Panel: SizePositionPanel };
        case PanelTypes.LINK:
          return { type, Panel: LinkPanel };
        case PanelTypes.TEXT_STYLE:
          return { type, Panel: TextStylePanel };
        case PanelTypes.SHAPE_STYLE:
          return { type, Panel: ShapeStylePanel };
        case PanelTypes.BORDER:
          return { type, Panel: BorderStylePanel };
        case PanelTypes.VIDEO_OPTIONS:
          return { type, Panel: VideoOptionsPanel };
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
