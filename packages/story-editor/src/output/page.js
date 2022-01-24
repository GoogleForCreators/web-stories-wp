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
import { getTotalDuration, StoryAnimation } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../types';
import isElementBelowLimit from '../utils/isElementBelowLimit';
import { ELEMENT_TYPES } from '../elements';
import OutputElement from './element';
import getLongestMediaElement from './utils/getLongestMediaElement';
import HiddenAudio from './utils/HiddenAudio';

const ASPECT_RATIO = `${PAGE_WIDTH}:${PAGE_HEIGHT}`;

function OutputPage({ page, autoAdvance = true, defaultPageDuration = 7 }) {
  const {
    id,
    animations,
    elements,
    backgroundColor,
    backgroundAudio,
    tracks: backgroundAudioTracks = [],
    pageAttachment,
  } = page;
  const { ctaText, url, icon, theme, rel = [] } = pageAttachment || {};

  const [backgroundElement, ...regularElements] = elements;

  // If the background element has base color set, it's media, use that.
  const baseColor = backgroundElement?.resource?.baseColor;
  const backgroundStyles = baseColor
    ? { backgroundColor: baseColor }
    : { backgroundColor: 'white', ...generatePatternStyles(backgroundColor) };

  const animationDuration = getTotalDuration({ animations }) / 1000;
  // If the page doesn't have media, take either the animations time or the configured default duration time.
  const nonMediaPageDuration = Math.max(
    animationDuration || 0,
    defaultPageDuration
  );
  // If we have media, take the media time for advancement time and ignore the default,
  // but still consider animation time as the minimum, too.
  const longestMediaElement = getLongestMediaElement(
    elements,
    animationDuration || 1
  );
  const autoAdvanceAfter = longestMediaElement?.id
    ? `el-${longestMediaElement?.id}-media`
    : `${nonMediaPageDuration}s`;

  // Remove invalid links, @todo this should come from the pre-publish checklist in the future.
  const validElements = regularElements.map((element) =>
    !url || !isElementBelowLimit(element)
      ? element
      : {
          ...element,
          link: null,
        }
  );

  const videoCaptions = elements
    .filter(
      ({ type, tracks }) => type === ELEMENT_TYPES.VIDEO && tracks?.length > 0
    )
    .map(({ id: videoId }) => `el-${videoId}-captions`);

  const hasBackgroundAudioWithTracks =
    backgroundAudio?.src && backgroundAudioTracks?.length > 0;

  if (hasBackgroundAudioWithTracks) {
    videoCaptions.push(`el-${backgroundAudio.id}-captions`);
  }

  const backgroundAudioSrc =
    !hasBackgroundAudioWithTracks && backgroundAudio?.src
      ? backgroundAudio.src
      : undefined;

  return (
    <amp-story-page
      id={id}
      auto-advance-after={autoAdvance ? autoAdvanceAfter : undefined}
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
              {validElements.map((element) => (
                <OutputElement key={element.id} element={element} />
              ))}
            </div>
          </div>
        </amp-story-grid-layer>
      </StoryAnimation.Provider>
      {hasBackgroundAudioWithTracks && (
        <HiddenAudio
          backgroundAudio={backgroundAudio}
          tracks={backgroundAudioTracks}
          id={id}
        />
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
};

export default OutputPage;
