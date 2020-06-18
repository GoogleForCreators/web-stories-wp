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
 * Internal dependencies
 */
import StoryAnimation from '../../dashboard/components/storyAnimation';
import StoryPropTypes from '../types';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../constants';
import generatePatternStyles from '../utils/generatePatternStyles';
import OutputElement from './element';
import getLongestMediaElement from './utils/getLongestMediaElement';

const ASPECT_RATIO = `${PAGE_WIDTH}:${PAGE_HEIGHT}`;

function OutputPage({ page, autoAdvance, defaultPageDuration }) {
  const { id, animations, elements, backgroundColor } = page;
  const backgroundStyles = {
    backgroundColor: 'white',
    ...generatePatternStyles(backgroundColor),
  };
  const [backgroundElement, ...regularElements] = elements;
  const longestMediaElement = getLongestMediaElement(elements);

  const autoAdvanceAfter = longestMediaElement?.id
    ? `el-${longestMediaElement?.id}-media`
    : `${defaultPageDuration}s`;

  return (
    <amp-story-page
      id={id}
      auto-advance-after={autoAdvance ? autoAdvanceAfter : undefined}
    >
      <StoryAnimation.Provider animations={animations}>
        <StoryAnimation.AMPAnimations />

        {backgroundElement && (
          <amp-story-grid-layer template="vertical" aspect-ratio={ASPECT_RATIO}>
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

        <amp-story-grid-layer template="vertical" aspect-ratio={ASPECT_RATIO}>
          <div className="page-fullbleed-area">
            <div className="page-safe-area">
              {regularElements.map((element) => (
                <OutputElement key={'el-' + element.id} element={element} />
              ))}
            </div>
          </div>
        </amp-story-grid-layer>
      </StoryAnimation.Provider>
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
