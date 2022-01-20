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
import { ResourcePropTypes } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { BackgroundAudioPropType } from '../../types';

function HiddenAudio({ backgroundAudio, tracks, id }) {
  const { mimeType, src } = backgroundAudio;

  const sourceProps = {
    type: mimeType,
    src,
  };

  const videoProps = {
    autoPlay: 'autoplay',
    layout: 'responsive',
    width: '0',
    height: '0',
    loop: 'loop',
  };

  return (
    <amp-story-grid-layer template="fill">
      <amp-video
        {...videoProps}
        id={`page-${id}-background-audio`}
        // Actual <amp-story-captions> output happens in OutputPage.
        captions-id={tracks?.length > 0 ? `el-${id}-captions` : undefined}
      >
        <source {...sourceProps} />
        {tracks &&
          tracks.map(({ srclang, label, kind, track, id: key }, i) => (
            <track
              srcLang={srclang}
              label={label}
              kind={kind}
              src={track}
              key={key}
              default={i === 0}
            />
          ))}
      </amp-video>
    </amp-story-grid-layer>
  );
}

HiddenAudio.propTypes = {
  backgroundAudio: BackgroundAudioPropType,
  id: PropTypes.string.isRequired,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource).isRequired,
};

export default HiddenAudio;
