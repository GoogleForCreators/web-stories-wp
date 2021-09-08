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
import useVideoTrim from '../../components/videoTrim/useVideoTrim';
import StoryPropTypes from '../../types';
import MediaEdit from '../media/edit';
import Trim from './trim';

function VideoEdit({ element, box, ...rest }) {
  const { isTrimMode } = useVideoTrim(({ state: { isTrimMode } }) => ({
    isTrimMode,
  }));

  if (isTrimMode) {
    return <Trim element={element} box={box} {...rest} />;
  }

  return <MediaEdit element={element} box={box} {...rest} />;
}

VideoEdit.propTypes = {
  element: StoryPropTypes.elements.video.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default VideoEdit;
