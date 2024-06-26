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
import { isBlobURL } from '@googleforcreators/media';
import type { VideoElement, OutputProps } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import MediaOutput from '../media/output';
import Captions from './captions';

function defaultForUndefined<V, D>(value: V | undefined, def: D): V | D {
  return value === undefined ? def : value;
}

function VideoOutput({ element, box, flags }: OutputProps<VideoElement>) {
  const { resource, loop, tracks, volume } = element;
  const { isMuted, mimeType, src } = resource;

  const poster = defaultForUndefined(element.poster, resource.poster);
  const alt = defaultForUndefined(element.alt, resource.alt);

  const sourceProps = {
    type: mimeType,
    src: flags?.allowBlobs || !isBlobURL(src) ? src : '',
  };

  const videoProps = {
    autoplay: 'autoplay',
    poster: flags?.allowBlobs || !isBlobURL(poster) ? poster : '',
    artwork: flags?.allowBlobs || !isBlobURL(poster) ? poster : '',
    title: alt,
    alt,
    loop: loop ? 'loop' : undefined,
    noaudio: isMuted ? 'noaudio' : undefined,
    volume: !isMuted && volume ? volume : undefined,
  };

  return (
    <MediaOutput element={element} box={box} data-leaf-element="true">
      <amp-video
        layout="fill"
        {...videoProps}
        id={`el-${element.id}-media`}
        // Actual <amp-story-captions> output happens in OutputPage.
        captions-id={
          tracks?.length > 0 ? `el-${element.id}-captions` : undefined
        }
      >
        <source {...sourceProps} />
        <Captions tracks={tracks} />
      </amp-video>
    </MediaOutput>
  );
}

export default VideoOutput;
