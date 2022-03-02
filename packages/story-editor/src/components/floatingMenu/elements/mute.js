/*
 * Copyright 2021 Google LLC
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
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { IconButton } from './shared';
import useVideoTranscoding from './shared/useVideoTranscoding';

function Mute() {
  const { canMute, isMuting, isDisabled, handleMute } = useVideoTranscoding();

  if (!canMute) {
    return null;
  }

  const title = isMuting
    ? __('Removing audio', 'web-stories')
    : __('Remove audio', 'web-stories');

  return (
    <IconButton
      Icon={Icons.Muted}
      title={title}
      isDisabled={isDisabled || isMuting}
      onClick={handleMute}
    />
  );
}

export default Mute;
