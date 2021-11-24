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
import { __ } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  useGlobalKeyDownEffect,
  Icons,
} from '@web-stories-wp/design-system';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useStory, useLocalMedia, useHistory } from '../../../app';
import Tooltip from '../../tooltip';
import ButtonWithChecklistWarning from './buttonWithChecklistWarning';

function UpdateButton({ hasUpdates = false, forceIsSaving = false }) {
  const {
    isSaving: _isSaving,
    status,
    saveStory,
    canPublish,
  } = useStory(
    ({
      state: {
        meta: { isSaving },
        story: { status },
        capabilities,
      },
      actions: { saveStory },
    }) => ({
      isSaving,
      status,
      saveStory,
      canPublish: Boolean(capabilities?.publish),
    })
  );

  const isSaving = _isSaving || forceIsSaving;

  const { isUploading } = useLocalMedia((state) => ({
    isUploading: state.state.isUploading,
  }));
  const {
    state: { hasNewChanges },
  } = useHistory();

  useGlobalKeyDownEffect(
    { key: ['mod+s'] },
    (event) => {
      event.preventDefault();
      if (isSaving) {
        return;
      }
      saveStory();
    },
    [saveStory, isSaving]
  );

  // The button is enabled only if we're not already saving nor uploading. And
  // then only if there are new changes or the story has meta-boxes – as these
  // can update without us knowing it.
  const isEnabled = !isSaving && !isUploading && (hasNewChanges || hasUpdates);

  if ('pending' === status) {
    return (
      <Tooltip title={__('Save as pending', 'web-stories')} hasTail>
        <Button
          variant={BUTTON_VARIANTS.SQUARE}
          type={BUTTON_TYPES.QUATERNARY}
          size={BUTTON_SIZES.SMALL}
          onClick={() => saveStory()}
          disabled={!isEnabled}
          aria-label={__('Save as pending', 'web-stories')}
        >
          <Icons.FloppyDisk />
        </Button>
      </Tooltip>
    );
  }

  if ('draft' === status) {
    return (
      <Tooltip title={__('Save draft', 'web-stories')} hasTail>
        <Button
          variant={BUTTON_VARIANTS.SQUARE}
          type={BUTTON_TYPES.QUATERNARY}
          size={BUTTON_SIZES.SMALL}
          onClick={() => saveStory({ status: 'draft' })}
          disabled={!isEnabled}
          aria-label={__('Save draft', 'web-stories')}
        >
          <Icons.FloppyDisk />
        </Button>
      </Tooltip>
    );
  }

  const text =
    'future' === status
      ? __('Schedule', 'web-stories')
      : __('Update', 'web-stories');

  return (
    <ButtonWithChecklistWarning
      text={text}
      onClick={() => saveStory()}
      disabled={isSaving || isUploading}
      isUploading={isUploading}
      canPublish={canPublish}
    />
  );
}

UpdateButton.propTypes = {
  hasUpdates: PropTypes.bool,
  forceIsSaving: PropTypes.bool,
};

export default UpdateButton;
