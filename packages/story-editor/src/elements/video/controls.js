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

/**
 * Internal dependencies
 */
import { useStory } from '../../app/story';
import StoryPropTypes from '../../types';
import PlayPauseButton from './playPauseButton';

function VideoControls({
  box,
  isSelected,
  isEditing,
  isTransforming,
  elementRef,
  element,
}) {
  const isActive = useStory(
    ({ state }) =>
      state.selectedElementIds.length === 1 &&
      isSelected &&
      !isTransforming &&
      !isEditing
  );

  return (
    <PlayPauseButton
      box={box}
      isActive={isActive}
      isTransforming={isTransforming}
      elementRef={elementRef}
      element={element}
    />
  );
}

VideoControls.propTypes = {
  box: StoryPropTypes.box.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isTransforming: PropTypes.bool.isRequired,
  elementRef: PropTypes.object.isRequired,
  element: StoryPropTypes.element.isRequired,
};

export default VideoControls;
