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

const ASPECT_RATIO = `${PAGE_WIDTH}:${PAGE_HEIGHT}`;

function OutputPage({
  page,
  autoAdvance = DEFAULT_AUTO_ADVANCE,
  defaultPageDuration = DEFAULT_PAGE_DURATION,
}) {
  const {
    id,
    animations,
    elements,
    backgroundColor,
    backgroundAudio = {},
    pageAttachment = {},
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
    const { id: elementId, type, tagName = 'auto' } = element;

    if ('text' === type && 'auto' === tagName) {
      element.tagName = tagNamesMap.get(elementId);
    }

    // Remove invalid links.
    // TODO: this should come from the pre-publish checklist in the future.
    if (pageAttachment?.url && isElementBelowLimit(element)) {
      delete element.link;
    }

    return element;
  });

  const videoCaptions = elements
    .filter(
      ({ type, tracks }) => type === ELEMENT_TYPES.VIDEO && tracks?.length > 0
    )
    .map(({ id: videoId }) => `el-${videoId}-captions`);

  const backgroundAudioSrc = backgroundAudio.resource?.src;
  const hasBackgroundAudioCaptions = backgroundAudio.tracks?.length > 0;
  const hasNonLoopingBackgroundAudio =
    false === backgroundAudio.loop && backgroundAudio.resource?.length;
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
                <OutputElement element={backgroundElement} />
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
                <OutputElement key={element.id} element={element} />
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
