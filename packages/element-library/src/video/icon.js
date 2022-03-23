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
import { Icons } from '@googleforcreators/design-system';
import PropTypes from 'prop-types';
import { StoryPropTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import VideoImage from '../media/videoImage';
import VisibleImage from '../media/visibleImage';

function VideoLayerIcon({
  element: {
    resource: { poster: defaultPoster, src },
    poster,
  },
  showVideoPreviewAsBackup,
}) {
  const iconImage = poster?.length ? poster : defaultPoster;

  // The image/video is purely decorative by default, because the alt text is already used
  // for the layer description. Hence using alt="" / title="" to avoid repetition.
  if (!iconImage && showVideoPreviewAsBackup) {
    return <VideoImage src={src} alt="" />;
  } else if (!iconImage) {
    return <Icons.Video width={21} height={21} title="" />;
  }

  return <VisibleImage src={iconImage} width={21} height={21} />;
}

VideoLayerIcon.propTypes = {
  element: StoryPropTypes.element.isRequired,
  showVideoPreviewAsBackup: PropTypes.bool,
};

export default VideoLayerIcon;
