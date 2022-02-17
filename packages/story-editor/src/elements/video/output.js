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

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import MediaOutput from '../media/output';
import Captions from './captions';

function defaultForUndefined(value, def) {
  return value === undefined ? def : value;
}

function VideoOutput({ element, box }) {
  const { resource, loop, tracks } = element;
  const { isMuted, mimeType, src } = resource;

  const poster = defaultForUndefined(element.poster, resource.poster);
  const alt = defaultForUndefined(element.alt, resource.alt);

  const sourceProps = {
    type: mimeType,
    src: !isBlobURL(src) ? src : '',
  };

  const videoProps = {
    autoPlay: 'autoplay',
    poster: !isBlobURL(poster) ? poster : '',
    artwork: !isBlobURL(poster) ? poster : '',
    title: alt,
    alt,
    layout: 'fill',
    loop: loop ? 'loop' : undefined,
    noaudio: isMuted ? 'noaudio' : undefined,
  };

  return (
    <MediaOutput element={element} box={box} data-leaf-element="true">
      <amp-video
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

VideoOutput.propTypes = {
  element: StoryPropTypes.elements.video.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default VideoOutput;
