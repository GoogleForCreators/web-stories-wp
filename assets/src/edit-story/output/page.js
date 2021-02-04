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
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getTotalDuration, StoryAnimation } from '../../animation';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../constants';
import StoryPropTypes from '../types';
import generatePatternStyles from '../utils/generatePatternStyles';
import isElementBelowLimit from '../utils/isElementBelowLimit';
import OutputElement from './element';
import getLongestMediaElement from './utils/getLongestMediaElement';

const ASPECT_RATIO = `${PAGE_WIDTH}:${PAGE_HEIGHT}`;

function OutputPage({ page, autoAdvance, defaultPageDuration }) {
  const { id, animations, elements, backgroundColor } = page;

  const [backgroundElement, ...regularElements] = elements;
  const animationDuration = getTotalDuration({ animations }) / 1000;
  const nonMediaPageDuration = Math.max(
    animationDuration || 0,
    defaultPageDuration
  );
  const longestMediaElement = getLongestMediaElement(
    elements,
    nonMediaPageDuration
  );

  // If the background element has base color set, it's media, use that.
  const baseColor = backgroundElement?.resource?.baseColor;
  const backgroundStyles = baseColor
    ? {
        backgroundColor: `rgb(${baseColor[0]},${baseColor[1]},${baseColor[2]})`,
      }
    : {
        backgroundColor: 'white',
        ...generatePatternStyles(backgroundColor),
      };

  const autoAdvanceAfter = longestMediaElement?.id
    ? `el-${longestMediaElement?.id}-media`
    : `${nonMediaPageDuration}s`;

  const hasPageAttachment = page.pageAttachment?.url?.length > 0;

  // Remove invalid links, @todo this should come from the pre-publish checklist in the future.
  const validElements = regularElements.map((element) =>
    !hasPageAttachment || !isElementBelowLimit(element)
      ? element
      : {
          ...element,
          link: null,
        }
  );

  return (
    <amp-story-page
      id={id}
      auto-advance-after={autoAdvance ? autoAdvanceAfter : undefined}
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
                {backgroundElement.backgroundOverlay && (
                  <div
                    className="page-background-overlay-area"
                    style={generatePatternStyles(
                      backgroundElement.backgroundOverlay
                    )}
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
      {hasPageAttachment && (
        <amp-story-page-attachment
          layout="nodisplay"
          href={page.pageAttachment.url}
          data-cta-text={
            page.pageAttachment.ctaText || __('Learn more', 'web-stories')
          }
        />
      )}
    </amp-story-page>
  );
}

OutputPage.propTypes = {
  page: StoryPropTypes.page.isRequired,
  autoAdvance: PropTypes.bool,
  defaultPageDuration: PropTypes.number,
};

OutputPage.defaultProps = {
  autoAdvance: true,
  defaultPageDuration: 7,
};

export default OutputPage;
