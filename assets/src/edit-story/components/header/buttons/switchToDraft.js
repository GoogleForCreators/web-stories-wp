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
import { useCallback } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory, useLocalMedia } from '../../../app';
import {
  Icons,
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  TOOLTIP_PLACEMENT,
  Tooltip,
} from '../../../../design-system';

function SwitchToDraft() {
  const { isSaving, saveStory } = useStory(
    ({
      state: {
        meta: { isSaving },
      },
      actions: { saveStory },
    }) => ({ isSaving, saveStory })
  );
  const { isUploading } = useLocalMedia((state) => ({
    isUploading: state.state.isUploading,
  }));

  const handleUnPublish = useCallback(() => saveStory({ status: 'draft' }), [
    saveStory,
  ]);

  const label = __('Switch to Draft', 'web-stories');
  return (
    <Tooltip title={label} placement={TOOLTIP_PLACEMENT.BOTTOM} hasTail>
      <Button
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        onClick={handleUnPublish}
        disabled={isSaving || isUploading}
        aria-label={label}
      >
        <Icons.PageSwap />
      </Button>
    </Tooltip>
  );
}

export default SwitchToDraft;
