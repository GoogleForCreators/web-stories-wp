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
import StoryPropTypes from '../types';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../constants';
import { generateOverlayStyles, OverlayType } from '../utils/backgroundOverlay';
import generatePatternStyles from '../utils/generatePatternStyles';
import OutputElement from './element';
import getLongestMediaElement from './utils/getLongestMediaElement';

const ASPECT_RATIO = `${PAGE_WIDTH}:${PAGE_HEIGHT}`;

function OutputPage({ page, autoAdvance, defaultPageDuration }) {
  const { id, elements, backgroundOverlay, backgroundColor } = page;
  const backgroundStyles = {
    backgroundColor: 'white',
    ...generatePatternStyles(backgroundColor),
  };
  const backgroundOverlayStyles = generateOverlayStyles(backgroundOverlay);
  const backgroundElements = elements.filter((element) => element.isBackground);
  const regularElements = elements.filter((element) => !element.isBackground);
  const longestMediaElement = getLongestMediaElement(elements);

  const autoAdvanceAfter = longestMediaElement?.id
    ? `el-${longestMediaElement?.id}-media`
    : `${defaultPageDuration}s`;

  return (
    <amp-story-page
      id={id}
      auto-advance-after={autoAdvance ? autoAdvanceAfter : undefined}
    >
      {backgroundElements.length > 0 && (
        <amp-story-grid-layer template="vertical" aspect-ratio={ASPECT_RATIO}>
          <div className="page-fullbleed-area" style={backgroundStyles}>
            <div className="page-safe-area">
              {backgroundElements.map((element) => (
                <OutputElement key={'el-' + element.id} element={element} />
              ))}
            </div>
          </div>
          {backgroundOverlay && backgroundOverlay !== OverlayType.NONE && (
            <div
              className="page-fullbleed-area"
              style={{ ...backgroundOverlayStyles }}
            />
          )}
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
