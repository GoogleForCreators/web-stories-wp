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
import { useCallback } from '@googleforcreators/react';
import { Icons } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { MediaUploadButton } from '../../form';
import { useStory } from '../../../app';
import { IconButton, useProperties } from './shared';

function SwapMedia() {
  const { type } = useProperties(['type']);
  const updateSelectedElements = useStory(
    (state) => state.actions.updateSelectedElements
  );

  /**
   * Callback of select in media picker to replace background media.
   *
   * @param {Object} resource Object coming from backbone media picker.
   */
  const onSelect = useCallback(
    (resource) => {
      updateSelectedElements({
        properties: { type: resource.type, resource },
      });
      trackEvent('floating_menu', {
        name: 'replace_media',
        element: type,
      });
    },
    [updateSelectedElements, type]
  );

  const renderReplaceButton = useCallback(
    (open) => (
      <IconButton
        onClick={open}
        title={__('Replace media', 'web-stories')}
        Icon={Icons.PictureSwap}
      />
    ),
    []
  );
  return (
    <MediaUploadButton
      buttonInsertText={__('Replace media', 'web-stories')}
      onInsert={onSelect}
      renderButton={renderReplaceButton}
    />
  );
}

export default SwapMedia;
