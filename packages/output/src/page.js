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
import PropTypes from 'prop-types';
import { generatePatternStyles } from '@googleforcreators/patterns';
import { PAGE_HEIGHT, PAGE_WIDTH } from '@googleforcreators/units';
import { StoryAnimation } from '@googleforcreators/animation';
import {
  ELEMENT_TYPES,
  StoryPropTypes,
  isElementBelowLimit,
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

function OutputPage({
  page,
  autoAdvance = DEFAULT_AUTO_ADVANCE,
  defaultPageDuration = DEFAULT_PAGE_DURATION,
  flags,
}) {
  const {
    id,
    animations,
    elements,
    backgroundColor,
    backgroundAudio,
    pageAttachment,
  } = page;

  const [backgroundElement, ...otherElements] = elements;

  // If the background element has base color set, it's media, use that.
  const baseColor = backgroundElement?.resource?.baseColor;
  const backgroundStyles = baseColor
    ? { backgroundColor: baseColor }
    : { backgroundColor: 'white', ...generatePatternStyles(backgroundColor) };

  const autoAdvanceAfter = autoAdvance
    ? getAutoAdvanceAfter({
        animations,
        elements,
        defaultPageDuration,
        backgroundAudio,
        id,
      })
    : undefined;

  const tagNamesMap = getTextElementTagNames(
    otherElements.filter(({ type }) => 'text' === type)
  );

  const regularElements = otherElements.map((element) => {
    // Check if we need to change anything in this element

    // Text elements need a tag name
    const needsTagName = 'text' === element.type;
    // Invalid links must be removed
    // TODO: this should come from the pre-publish checklist in the future.
    const hasIllegalLink = pageAttachment?.url && isElementBelowLimit(element);
    const requiresChange = needsTagName || hasIllegalLink;

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

  const products = elements
    .filter(({ type }) => type === ELEMENT_TYPES.PRODUCT)
    .map(({ product }) => product)
    .filter(Boolean);

  const videoCaptions = elements
    .filter(
      ({ type, tracks }) => type === ELEMENT_TYPES.VIDEO && tracks?.length > 0
    )
    .map(({ id: videoId }) => `el-${videoId}-captions`);

  const backgroundAudioSrc = backgroundAudio?.resource?.src;
  const hasBackgroundAudioCaptions = backgroundAudio?.tracks?.length > 0;
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

      {backgroundAudioSrc && needsEnhancedBackgroundAudio && (
        <BackgroundAudio backgroundAudio={backgroundAudio} id={id} />
      )}

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
      {pageAttachment?.url && <Outlink {...pageAttachment} />}
      {products.length > 0 && flags?.shoppingIntegration && (
        <ShoppingAttachment products={products} {...pageAttachment} />
      )}
    </amp-story-page>
  );
}

OutputPage.propTypes = {
  page: StoryPropTypes.page.isRequired,
  autoAdvance: PropTypes.bool,
  defaultPageDuration: PropTypes.number,
  flags: PropTypes.object,
};

export default OutputPage;
