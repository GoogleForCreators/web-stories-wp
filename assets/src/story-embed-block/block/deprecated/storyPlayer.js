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
import { forwardRef } from '@wordpress/element';

function StoryPlayer({ url, title, poster, width, height }, ref) {
  return (
    <amp-story-player
      ref={ref}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
      data-testid="amp-story-player"
    >
      <a
        href={url}
        style={{
          ['--story-player-poster']: poster ? `url('${poster}')` : undefined,
        }}
      >
        {title}
      </a>
    </amp-story-player>
  );
}

StoryPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  poster: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

const StoryPlayerWithRef = forwardRef(StoryPlayer);

export default StoryPlayerWithRef;
