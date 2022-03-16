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
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import useVideoElementTranscoding from '../../../app/media/utils/useVideoElementTranscoding';
import { IconButton, useProperties } from './shared';

function Trim() {
  const { id: elementId, resource } = useProperties(['id', 'resource']);
  const {
    state: { canTrim, isTrimming, isDisabled },
    actions: { handleTrim },
  } = useVideoElementTranscoding({
    elementId,
    resource,
  });

  if (!canTrim) {
    return null;
  }

  const title = isTrimming
    ? __('Trimming video', 'web-stories')
    : __('Trim video', 'web-stories');

  const handleClick = () => {
    trackEvent('floating_menu', {
      name: 'set_trim',
    });
    handleTrim();
  };
  return (
    <IconButton
      Icon={Icons.Scissors}
      title={title}
      disabled={isDisabled || isTrimming}
      onClick={handleClick}
    />
  );
}

export default Trim;
