/*
 * Copyright 2021 Google LLC
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
import { RawHTML } from '@wordpress/element';

function Singleton({ title, poster, width, height }) {
  return (
    <div className="web-stories-singleton">
      <div
        className="wp-block-embed__wrapper"
        style={{
          '--aspect-ratio': 0 !== height ? width / height : 1,
          '--width': `${width}px`,
          '--height': `${height}px`,
        }}
      >
        <div className="web-stories-singleton-poster">
          {poster ? (
            <img src={poster} alt={title} />
          ) : (
            <div className="web-stories-singleton-poster-placeholder">
              <span>{title}</span>
            </div>
          )}
        </div>
        <div className="web-stories-singleton-overlay">
          {title && (
            <RawHTML className="story-content-overlay__title">{title}</RawHTML>
          )}
        </div>
      </div>
    </div>
  );
}

Singleton.propTypes = {
  title: PropTypes.string,
  poster: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Singleton;
