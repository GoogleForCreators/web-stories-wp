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
import { BackgroundAudioPropType } from '@googleforcreators/elements';

function BackgroundAudio({ backgroundAudio, id }) {
  const { resource, tracks, loop } = backgroundAudio || {};
  const { mimeType, src } = resource;

  const videoProps = {
    loop: loop ? 'loop' : undefined,
    id: `page-${id}-background-audio`,
    // Actual <amp-story-captions> output happens in OutputPage.
    'captions-id': tracks?.length > 0 ? `el-${id}-captions` : undefined,
    // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track#attr-src
    // and https://github.com/GoogleForCreators/web-stories-wp/issues/11479
    crossorigin: tracks?.length > 0 ? 'anonymous' : undefined,
  };

  const sourceProps = {
    type: mimeType,
    src,
  };

  return (
    <amp-story-grid-layer template="fill">
      <amp-video
        autoPlay="autoplay"
        // Not using "nodisplay" here, because it might cause the audio to
        // not actually load at all.
        // The good thing is that even with a layout, there's nothing visible
        // on the screen because it's an audio file and not a video.
        layout="fixed"
        width="1"
        height="1"
        poster=""
        {...videoProps}
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

BackgroundAudio.propTypes = {
  backgroundAudio: PropTypes.shape({
    resource: BackgroundAudioPropType,
    loop: PropTypes.bool,
    tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  }),
  id: PropTypes.string.isRequired,
};

export default BackgroundAudio;
