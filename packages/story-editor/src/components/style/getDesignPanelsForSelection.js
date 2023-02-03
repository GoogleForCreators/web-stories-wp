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
  TextAccessibilityPanel,
  TextStylePanel,
  VideoAccessibilityPanel,
  ElementAlignmentPanel,
  VideoOptionsPanel,
  VideoSegmentPanel,
  PageBackgroundAudioPanel,
  PageAdvancementPanel,
  ProductPanel,
} from '../panels/design';

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
        type: PanelTypes.PageBackground,
        Panel: PageBackgroundPanel,
      });
      panels.push({
        type: PanelTypes.Filter,
        Panel: FilterPanel,
      });
      panels.push({ type: PanelTypes.Animation, Panel: AnimationPanel });
    }

    // If the selected element's type is video / image , display accessibility panel, too.
    if ('video' === elements[0].type) {
      panels.push({ type: PanelTypes.VideoOptions, Panel: VideoOptionsPanel });
      panels.push({ type: PanelTypes.VideoSegment, Panel: VideoSegmentPanel });
      panels.push({
        type: PanelTypes.Captions,
        Panel: CaptionsPanel,
      });
      panels.push({
        type: PanelTypes.VideoAcessibility,
        Panel: VideoAccessibilityPanel,
      });
    } else if (['gif', 'image'].includes(elements[0].type)) {
      panels.push({
        type: PanelTypes.ImageAccessibility,
        Panel: ImageAccessibilityPanel,
      });
      // In case of default background without media:
    } else {
      panels.unshift({
        type: PanelTypes.PageBackground,
        Panel: PageBackgroundPanel,
      });
    }

    panels.push({
      type: PanelTypes.PageAttachment,
      Panel: PageAttachmentPanel,
    });

    panels.push({
      type: PanelTypes.PageBackgroundAudio,
      Panel: PageBackgroundAudioPanel,
    });

    panels.push({
      type: PanelTypes.PageAdvancement,
      Panel: PageAdvancementPanel,
    });

    return panels;
  }

  // Find which panels all the selected elements have in common
  return elements
    .map(({ type }) => elementTypes[type].panels)
    .reduce((commonPanels, panels) => intersect(commonPanels, panels), ALL)
    .map((type) => {
      switch (type) {
        case PanelTypes.Animation:
          return { type, Panel: AnimationPanel };
        case PanelTypes.PageBackground:
          // Only display when isBackground.
          return null;
        case PanelTypes.Filter:
          return { type, Panel: FilterPanel };
        case PanelTypes.SizePosition:
          return { type, Panel: SizePositionPanel };
        case PanelTypes.Link:
          return { type, Panel: LinkPanel };
        case PanelTypes.TextStyle:
          return { type, Panel: TextStylePanel };
        case PanelTypes.TextAccessibility:
          return { type, Panel: TextAccessibilityPanel };
        case PanelTypes.ShapeStyle:
          return { type, Panel: ShapeStylePanel };
        case PanelTypes.Border:
          return { type, Panel: BorderStylePanel };
        case PanelTypes.VideoOptions:
          return { type, Panel: VideoOptionsPanel };
        case PanelTypes.VideoSegment:
          return { type, Panel: VideoSegmentPanel };
        case PanelTypes.Captions:
          return { type, Panel: CaptionsPanel };
        case PanelTypes.VideoAcessibility:
          return { type, Panel: VideoAccessibilityPanel };
        case PanelTypes.ImageAccessibility:
          return { type, Panel: ImageAccessibilityPanel };
        case PanelTypes.ElementAlignment:
          return { type, Panel: ElementAlignmentPanel };
        case PanelTypes.Product: {
          return { type, Panel: ProductPanel };
        }
        default:
          throw new Error(`Unknown panel: ${type}`);
      }
    })
    .filter((panel) => panel);
}

export default getDesignPanelsForSelection;
