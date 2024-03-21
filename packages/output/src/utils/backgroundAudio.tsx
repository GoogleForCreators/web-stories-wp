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
import type {
  BackgroundAudio as BackgroundAudioType,
  ElementId,
} from '@googleforcreators/elements';

interface BackgroundAudioProps {
  backgroundAudio: BackgroundAudioType;
  id: ElementId;
}

function BackgroundAudio({ backgroundAudio, id }: BackgroundAudioProps) {
  const { resource, tracks, loop } = backgroundAudio;
  const { mimeType, src } = resource;

  const hasTracks = tracks?.length && tracks?.length > 0;

  const sourceProps = {
    type: mimeType,
    src,
  };

  return (
    <amp-story-grid-layer template="fill">
      <amp-video
        autoplay="autoplay"
        // Not using "nodisplay" here, because it might cause the audio to
        // not actually load at all.
        // The good thing is that even with a layout, there's nothing visible
        // on the screen because it's an audio file and not a video.
        layout="fixed"
        width="1"
        height="1"
        poster=""
        id={`page-${id}-background-audio`}
        loop={loop ? 'loop' : undefined}
        // Actual <amp-story-captions> output happens in OutputPage.
        captions-id={hasTracks ? `el-${id}-captions` : undefined}
        // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track#attr-src
        // and https://github.com/GoogleForCreators/web-stories-wp/issues/11479
        crossOrigin={hasTracks ? 'anonymous' : undefined}
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

export default BackgroundAudio;
