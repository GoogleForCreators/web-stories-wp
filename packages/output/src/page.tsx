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
import { AnimationProvider, AMPAnimations } from '@googleforcreators/animation';
import {
  isElementBelowLimit,
  type Page,
  elementIs,
  type Element,
} from '@googleforcreators/elements';

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

const ASPECT_RATIO = `${PAGE_WIDTH}:${PAGE_HEIGHT}`;

interface OutputPageProps {
  page: Page;
  defaultAutoAdvance?: boolean;
  defaultPageDuration?: number;
  flags: Record<string, boolean>;
}

function OutputPage({
  page,
  defaultAutoAdvance = DEFAULT_AUTO_ADVANCE,
  defaultPageDuration = DEFAULT_PAGE_DURATION,
  flags,
}: OutputPageProps) {
  const {
    id,
    animations,
    advancement,
    elements,
    backgroundColor,
    backgroundAudio,
    pageAttachment = null,
    shoppingAttachment = {},
  } = page;

  // Note: backgroundElement is undefined if elements is empty.
  const [backgroundElement, ...otherElements] = elements;

  // If the background element has base color set, it's media, use that.
  const baseColor =
    backgroundElement && elementIs.media(backgroundElement)
      ? backgroundElement?.resource?.baseColor
      : undefined;
  const backgroundStyles = baseColor
    ? { backgroundColor: baseColor }
    : { backgroundColor: 'white', ...generatePatternStyles(backgroundColor) };

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

  const tagNamesMap = getTextElementTagNames(
    otherElements.filter(elementIs.text)
  );

  const regularElements = otherElements.map((element) => {
    // Check if we need to change anything in this element

    // Text elements need a tag name
    const needsTagName = elementIs.text(element);
    // Invalid links must be removed
    // TODO: this should come from the pre-publish checklist in the future.
    const hasIllegalLink = pageAttachment?.url && isElementBelowLimit(element);
    const requiresChange = needsTagName || hasIllegalLink;

    // If neither change needed, return original
    if (!requiresChange) {
      return element;
    }

    // At least one change needed, create shallow clone and modify that
    const newElement: Element = { ...element };
    if (elementIs.text(newElement)) {
      newElement.tagName = tagNamesMap.get(element.id);
    }
    if (hasIllegalLink) {
      delete newElement.link;
    }
    return newElement;
  });

  const products = elements
    .filter(elementIs.product)
    .filter(({ isHidden }) => !isHidden)
    .map(({ product }) => product)
    .filter(Boolean);

  const hasProducts = products.length > 0;
  const hasPageAttachment = pageAttachment?.url && !hasProducts;

  const videoCaptions = elements
    .filter(elementIs.video)
    .filter(({ tracks }) => tracks?.length > 0)
    .map(({ id: videoId }) => `el-${videoId}-captions`);

  const backgroundAudioSrc = backgroundAudio?.resource?.src;
  const hasBackgroundAudioCaptions = Boolean(backgroundAudio?.tracks?.length);
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
      <AnimationProvider animations={animations} elements={elements}>
        <AMPAnimations />

        {backgroundElement && (
          <amp-story-grid-layer
            template="vertical"
            aspect-ratio={ASPECT_RATIO}
            class="grid-layer"
          >
            <div className="page-fullbleed-area" style={backgroundStyles}>
              <div className="page-safe-area">
                <OutputElement element={backgroundElement} flags={flags} />
                {elementIs.overlayable(backgroundElement) && (
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
      </AnimationProvider>

      {videoCaptions.length > 0 && (
        <amp-story-grid-layer
          template="vertical"
          aspect-ratio={ASPECT_RATIO}
          class="grid-layer align-bottom"
        >
          <div className="captions-area">
            {videoCaptions.map((captionId) => (
              <amp-story-captions
                id={captionId}
                key={captionId}
                layout="container" // "container" layout will only occupy required height.
                style-preset="default"
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
