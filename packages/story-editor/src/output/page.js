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
import { __ } from '@googleforcreators/i18n';
import { generatePatternStyles } from '@googleforcreators/patterns';
import { PAGE_HEIGHT, PAGE_WIDTH } from '@googleforcreators/units';
import { StoryAnimation } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../types';
import isElementBelowLimit from '../utils/isElementBelowLimit';
import { ELEMENT_TYPES } from '../elements';
import { DEFAULT_AUTO_ADVANCE, DEFAULT_PAGE_DURATION } from '../constants';
import OutputElement from './element';
import HiddenAudio from './utils/HiddenAudio';
import getTextElementTagNames from './utils/getTextElementTagNames';
import getAutoAdvanceAfter from './utils/getAutoAdvanceAfter';

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
  const { ctaText, url, icon, theme, rel = [] } = pageAttachment || {};

  const {
    resource: backgroundAudioResource,
    tracks: backgroundAudioTracks = [],
    loop: backgroundAudioLoop = true,
  } = backgroundAudio || {};

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

    if (flags?.semanticHeadingTags) {
      if ('text' === type && 'auto' === tagName) {
        element.tagName = tagNamesMap.get(elementId);
      }
    }

    // Remove invalid links.
    // TODO: this should come from the pre-publish checklist in the future.
    if (url && isElementBelowLimit(element)) {
      delete element.link;
    }

    return element;
  });

  const videoCaptions = elements
    .filter(
      ({ type, tracks }) => type === ELEMENT_TYPES.VIDEO && tracks?.length > 0
    )
    .map(({ id: videoId }) => `el-${videoId}-captions`);

  const hasBackgroundAudioWithTracks =
    backgroundAudioResource?.src && backgroundAudioTracks?.length > 0;

  if (hasBackgroundAudioWithTracks) {
    videoCaptions.push(`el-${id}-captions`);
  }

  const isNonLoopingBackgroundAudio =
    backgroundAudioResource?.length && !backgroundAudioLoop;

  const backgroundAudioSrc =
    !hasBackgroundAudioWithTracks &&
    backgroundAudioLoop &&
    backgroundAudioResource?.src
      ? backgroundAudioResource.src
      : undefined;

  return (
    <amp-story-page
      id={id}
      auto-advance-after={autoAdvanceAfter}
      background-audio={backgroundAudioSrc}
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
      {(hasBackgroundAudioWithTracks || isNonLoopingBackgroundAudio) && (
        <HiddenAudio backgroundAudio={backgroundAudio} id={id} />
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
      {url && (
        <amp-story-page-outlink
          layout="nodisplay"
          cta-image={icon || undefined}
          theme={theme}
        >
          <a href={url} rel={rel.join(' ')}>
            {ctaText || __('Learn more', 'web-stories')}
          </a>
        </amp-story-page-outlink>
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
