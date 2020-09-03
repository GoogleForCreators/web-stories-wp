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
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import MediaOutput from '../media/output';

function defaultForUndefined(value, def) {
  return value === undefined ? def : value;
}

function VideoOutput({ element, box }) {
  const { resource, loop } = element;

  const sourceProps = {
    type: resource.mimeType,
    src: resource.src,
  };

  const props = {
    autoPlay: 'autoplay',
    poster: defaultForUndefined(element.poster, resource.poster),
    artwork: defaultForUndefined(element.poster, resource.poster),
    title: defaultForUndefined(element.title, resource.title),
    alt: defaultForUndefined(element.alt, resource.alt),
    layout: 'fill',
    loop: loop ? 'loop' : undefined,
  };

  // crossorigin='anonymous' is required to play videos from other domains.
  return (
    <MediaOutput element={element} box={box}>
      <amp-video {...props} id={`el-${element.id}-media`}>
        <source {...sourceProps} />
      </amp-video>
    </MediaOutput>
  );
}

VideoOutput.propTypes = {
  element: StoryPropTypes.elements.video.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default VideoOutput;
