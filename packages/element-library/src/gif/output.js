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
import { isBlobURL } from '@googleforcreators/media';
import { StoryPropTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import MediaOutput from '../media/output';

function GifOutput({ element, box, flags }) {
  const { resource } = element;

  const src =
    flags.allowBlobs || !isBlobURL(resource.output.src)
      ? resource.output.src
      : '';
  const poster =
    flags.allowBlobs || !isBlobURL(resource.poster) ? resource.poster : '';

  return (
    <MediaOutput element={element} box={box} data-leaf-element="true">
      <amp-video
        id={`el-${element.id}-media`}
        autoplay="autoplay"
        loop="loop"
        noaudio="noaudio"
        poster={poster || ''}
        layout="fill"
        alt={element.alt ?? resource.alt}
      >
        <source type={resource.output.mimeType} src={src} />
      </amp-video>
    </MediaOutput>
  );
}

GifOutput.propTypes = {
  element: StoryPropTypes.elements.gif.isRequired,
  box: StoryPropTypes.box.isRequired,
  flags: PropTypes.object,
};

export default GifOutput;
