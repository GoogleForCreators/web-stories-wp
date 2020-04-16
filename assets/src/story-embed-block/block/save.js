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

function save({ attributes }) {
  const {
    url,
    title,
    poster,
    width = 360,
    height = 600,
    align = 'none',
  } = attributes;

  // TODO: support embedding multiple stories?
  return (
    <div className={`align${align}`}>
      <amp-story-player
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <a
          href={url}
          style={{
            ['--story-player-poster']: poster ? `url('${poster}')` : undefined,
          }}
        >
          {title || 'Untitled'}
        </a>
      </amp-story-player>
    </div>
  );
}

save.propTypes = {
  attributes: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    poster: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    align: PropTypes.string,
  }).isRequired,
};

export default save;
