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
import { getOptions, isAfter, subMinutes, toDate } from '@web-stories-wp/date';

/**
 * Internal dependencies
 */
import { useStory, useLocalMedia, useHistory } from '../../../app';
import Tooltip from '../../tooltip';
import ButtonWithChecklistWarning from './buttonWithChecklistWarning';

function PlainButton({ text, onClick, disabled }) {
  return (
    <Tooltip title={text} hasTail>
      <Button
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.QUATERNARY}
        size={BUTTON_SIZES.SMALL}
        onClick={onClick}
        disabled={disabled}
        aria-label={text}
      >
        <Icons.FloppyDisk />
      </Button>
    </Tooltip>
  );
}

PlainButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

function UpdateButton({ hasUpdates = false, forceIsSaving = false }) {
  const {
    isSaving: _isSaving,
    status,
    date,
    saveStory,
    canPublish,
  } = useStory(
    ({
      state: {
        meta: { isSaving },
        story: { status, date },
        capabilities,
      },
      actions: { saveStory },
    }) => ({
      isSaving,
      status,
      date,
      saveStory,
      canPublish: Boolean(capabilities?.publish),
    })
  );

  const isSaving = _isSaving || forceIsSaving;

  const { isUploading } = useLocalMedia(({ state: { isUploading } }) => ({
    isUploading,
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

  const isPending = 'pending' === status;
  const isDraft = 'draft' === status || !status;

  if (isPending) {
    return (
      <PlainButton
        text={__('Save as pending', 'web-stories')}
        disabled={!isEnabled}
        onClick={() => saveStory()}
      />
    );
  }

  if (isDraft) {
    return (
      <PlainButton
        text={__('Save draft', 'web-stories')}
        disabled={!isEnabled}
        onClick={() => saveStory()}
      />
    );
  }

  // Offset the date by one minute to accommodate for network latency.
  const hasFutureDate = isAfter(
    subMinutes(toDate(date, getOptions()), 1),
    toDate(new Date(), getOptions())
  );

  const text =
    hasFutureDate && status !== 'private'
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
