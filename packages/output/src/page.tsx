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
import { generatePatternStyles } from '@googleforcreators/patterns';
import { PAGE_HEIGHT, PAGE_WIDTH } from '@googleforcreators/units';
import { StoryAnimation } from '@googleforcreators/animation';
import {
  ELEMENT_TYPES,
  isElementBelowLimit,
} from '@googleforcreators/elements';
import type {
  Element,
  ProductElement,
  TagName,
  TextElement,
  Product,
  VideoElement,
  MediaElement,
} from '@googleforcreators/types';
/**
 * Internal dependencies
 */
import { DEFAULT_AUTO_ADVANCE, DEFAULT_PAGE_DURATION } from './constants';
import OutputElement from './element';
import BackgroundAudio from './utils/backgroundAudio';
import getTextElementTagNames from './utils/getTextElementTagNames';
import getAutoAdvanceAfter from './utils/getAutoAdvanceAfter';
import Outlink from './utils/outlink';
import ShoppingAttachment from './utils/shoppingAttachment';
import type { PageObject } from './types';

const ASPECT_RATIO = `${PAGE_WIDTH}:${PAGE_HEIGHT}`;
function OutputPage({
  page,
  defaultAutoAdvance = DEFAULT_AUTO_ADVANCE,
  defaultPageDuration = DEFAULT_PAGE_DURATION,
  flags,
}: PageObject) {
  const {
    id,
    animations,
    advancement,
    elements,
    backgroundColor,
    backgroundAudio,
    shoppingAttachment = {},
    pageAttachment = {},
  } = page;

  const [backgroundElement, ...otherElements]: [MediaElement, ...Element[]] =
    elements as [MediaElement, ...Element[]];

  // If the background element has base color set, it's media, use that.
  const baseColor: string | undefined = backgroundElement?.resource?.baseColor;
  const backgroundStyles = baseColor
    ? { backgroundColor: baseColor }
    : { backgroundColor: 'white', ...generatePatternStyles(backgroundColor) };
  const textElements = otherElements as TextElement[];
  const productElements = elements as ProductElement[];
  const videoElements = elements as VideoElement[];
  const {
    autoAdvance = defaultAutoAdvance,
    pageDuration = defaultPageDuration,
  } = advancement || {};

  const autoAdvanceAfter = autoAdvance
    ? getAutoAdvanceAfter({
        animations,
        elements,
        defaultPageDuration: pageDuration,
        backgroundAudio,
        id,
      })
    : undefined;
  const isTextElement = ({ type }: TextElement) => 'text' === type;
  const tagNamesMap: Map<string, TagName> = getTextElementTagNames(
    textElements.filter(isTextElement)
  );

  const regularElements = textElements.map((element: TextElement) => {
    // Check if we need to change anything in this element

    // Text elements need a tag name
    const needsTagName = 'text' === element.type;
    // Invalid links must be removed
    // TODO: this should come from the pre-publish checklist in the future.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Needs fixing of elements package
    const hasIllegalLink: boolean =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- Needs fixing of elements package
      pageAttachment?.url && isElementBelowLimit(element);
    const requiresChange: boolean = needsTagName || hasIllegalLink;

    // If neither change needed, return original
    if (!requiresChange) {
      return element;
    }

    // At least one change needed, create shallow clone and modify that
    const newElement = { ...element };
    if (needsTagName) {
      newElement.tagName = tagNamesMap.get(element.id);
    }
    if (hasIllegalLink) {
      delete newElement.link;
    }
    return newElement;
  });

  const products = productElements
    .filter(({ type }: ProductElement) => type === ELEMENT_TYPES.PRODUCT)
    .map(({ product }: ProductElement): Product => product)
    .filter(Boolean);

  const hasProducts = products.length > 0;
  const hasPageAttachment = pageAttachment?.url && !hasProducts;

  const videoCaptions = videoElements
    .filter(
      ({ type, tracks }: VideoElement) =>
        type === ELEMENT_TYPES.VIDEO && tracks && tracks?.length > 0
    )
    .map(({ id: videoId }: Element) => `el-${videoId}-captions`);

  const backgroundAudioSrc = backgroundAudio?.resource?.src;
  const hasBackgroundAudioCaptions =
    (backgroundAudio?.tracks && backgroundAudio?.tracks?.length > 0) ?? false;
  const hasNonLoopingBackgroundAudio =
    false === backgroundAudio?.loop && backgroundAudio?.resource?.length;
  const needsEnhancedBackgroundAudio =
    hasBackgroundAudioCaptions || hasNonLoopingBackgroundAudio;

  if (backgroundAudioSrc && hasBackgroundAudioCaptions) {
    videoCaptions.push(`el-${id}-captions`);
  }

  return (
    <amp-story-page
      id={id}
      auto-advance-after={autoAdvanceAfter}
      background-audio={
        backgroundAudioSrc && !needsEnhancedBackgroundAudio
          ? backgroundAudioSrc
          : undefined
      }
    >
      <StoryAnimation.Provider animations={animations} elements={elements}>
        <StoryAnimation.AMPAnimations />

        {backgroundElement && (
          <amp-story-grid-layer
            template="vertical"
            aspect-ratio={ASPECT_RATIO}
            class="grid-layer"
          >
            <div className="page-fullbleed-area" style={backgroundStyles}>
              <div className="page-safe-area">
                <OutputElement element={backgroundElement} flags={flags} />
                {backgroundElement.overlay && (
                  <div
                    className="page-background-overlay-area"
                    style={generatePatternStyles(backgroundElement.overlay)}
                  />
                )}
              </div>
            </div>
          </amp-story-grid-layer>
        )}

        {backgroundAudioSrc && needsEnhancedBackgroundAudio && (
          <BackgroundAudio backgroundAudio={backgroundAudio} id={id} />
        )}

        <amp-story-grid-layer
          template="vertical"
          aspect-ratio={ASPECT_RATIO}
          class="grid-layer"
        >
          <div className="page-fullbleed-area">
            <div className="page-safe-area">
              {regularElements.map((element) => (
                <OutputElement
                  key={element.id}
                  element={element}
                  flags={flags}
                />
              ))}
            </div>
          </div>
        </amp-story-grid-layer>
      </StoryAnimation.Provider>

      {videoCaptions.length > 0 && (
        <amp-story-grid-layer
          template="vertical"
          aspect-ratio={ASPECT_RATIO}
          class="grid-layer align-bottom"
        >
          <div className="captions-area">
            {videoCaptions.map((captionId) => (
              <amp-story-captions
                key={captionId}
                id={captionId}
                layout="fixed-height"
                height="100"
              />
            ))}
          </div>
        </amp-story-grid-layer>
      )}

      {/* <amp-story-page-outlink> needs to be the last child element */}
      {hasPageAttachment && <Outlink {...pageAttachment} />}
      {hasProducts && (
        <ShoppingAttachment products={products} {...shoppingAttachment} />
      )}
    </amp-story-page>
  );
}

export default OutputPage;
