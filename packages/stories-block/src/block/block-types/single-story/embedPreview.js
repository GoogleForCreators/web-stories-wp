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
import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
} from '@wordpress/element';

/**
 * Internal dependencies
 */
import StoryPlayer from './storyPlayer';

function EmbedPreview({ url, title, poster, isSelected, width, height }, ref) {
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (!isSelected && interactive) {
      setInteractive(false);
    }
  }, [isSelected, interactive, setInteractive]);

  const hideOverlay = useCallback(() => setInteractive(true), [setInteractive]);

  return (
    <div
      className="web-stories-embed-preview wp-block-embed__wrapper"
      style={{
        '--aspect-ratio': 0 !== width ? height / width : 1,
        '--width': `${width}px`,
        '--height': `${height}px`,
      }}
    >
      <StoryPlayer
        url={url}
        title={title}
        poster={poster}
        ref={ref}
        onFocus={hideOverlay}
      />
      {!interactive && (
        <div
          className="web-stories-embed-preview-overlay"
          data-testid="embed-preview-overlay"
          onMouseUp={hideOverlay}
        />
      )}
    </div>
  );
}

const EmbedPreviewWithRef = forwardRef(EmbedPreview);

EmbedPreview.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  poster: PropTypes.string,
  isSelected: PropTypes.bool,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default EmbedPreviewWithRef;
