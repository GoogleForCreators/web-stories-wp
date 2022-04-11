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
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import {
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Tooltip,
} from '@googleforcreators/design-system';
import { useMemo } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { Z_INDEX_STORY_DETAILS } from '../../../constants/zIndex';
import useIsUploadingToStory from '../../../utils/useIsUploadingToStory';
import {
  useCheckpoint,
  PPC_CHECKPOINT_STATE,
  ChecklistIcon,
} from '../../checklist';

const Button = styled(DefaultButton)`
  padding: 4px 6px;
  height: 32px;
  svg {
    width: 24px;
    height: auto;
  }
`;

function InnerButton({
  text,
  checkpoint,
  hasHighPriorityIssues = false,
  onClick,
  ...buttonProps
}) {
  const handleClick = (evt) => {
    // https://github.com/reactjs/react-modal/issues/680#issuecomment-413422345
    // React Modal restores input on last focused element on close.
    // Blur button so that it doesn't steal focus back when opening the checklist.
    evt.currentTarget.blur();

    onClick?.(evt);
  };

  return (
    <Button
      variant={BUTTON_VARIANTS.RECTANGLE}
      type={BUTTON_TYPES.PRIMARY}
      size={BUTTON_SIZES.SMALL}
      onClick={handleClick}
      {...buttonProps}
    >
      {text}
      {hasHighPriorityIssues && <ChecklistIcon checkpoint={checkpoint} />}
    </Button>
  );
}

InnerButton.propTypes = {
  checkpoint: PropTypes.oneOf(Object.values(PPC_CHECKPOINT_STATE)),
  hasHighPriorityIssues: PropTypes.bool,
  onClick: PropTypes.func,
  text: PropTypes.node.isRequired,
};

function ButtonWithChecklistWarning({
  disabled,
  hasFutureDate,
  ...buttonProps
}) {
  const isUploading = useIsUploadingToStory();
  const { isSaving, canPublish, status } = useStory(({ state }) => ({
    isSaving: state.meta?.isSaving,
    status: state.story.status,
    canPublish: Boolean(state?.capabilities?.publish),
  }));

  const { checkpoint, hasHighPriorityIssues } = useCheckpoint(
    ({ state: { checkpoint, hasHighPriorityIssues } }) => ({
      checkpoint,
      hasHighPriorityIssues,
    })
  );
  const TOOLTIP_TEXT = {
    [PPC_CHECKPOINT_STATE.ALL]: hasHighPriorityIssues
      ? __(
          'Make updates before publishing to improve discoverability and performance on search engines',
          'web-stories'
        )
      : '',
    [PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED]: __(
      'Review checklist to improve performance before publishing',
      'web-stories'
    ),
    [PPC_CHECKPOINT_STATE.UNAVAILABLE]: '',
  };

  const TOOLTIP_TEXT_UPLOADING = __(
    'Saving is disabled due to media currently being uploaded.',
    'web-stories'
  );

  const TOOLTIP_TEXT_REVIEW = __(
    'Submit your work for review, and an Editor will be able to approve it for you.',
    'web-stories'
  );

  let toolTip = isUploading ? TOOLTIP_TEXT_UPLOADING : TOOLTIP_TEXT[checkpoint];

  if (!canPublish) {
    toolTip = TOOLTIP_TEXT_REVIEW;
  }

  const publishText = useMemo(
    () =>
      hasFutureDate && status !== 'private'
        ? __('Schedule', 'web-stories')
        : __('Publish', 'web-stories'),
    [hasFutureDate, status]
  );

  const text = canPublish
    ? publishText
    : __('Submit for review', 'web-stories');
  return (
    <Tooltip
      title={toolTip}
      popupZIndexOverride={Z_INDEX_STORY_DETAILS}
      hasTail
    >
      <InnerButton
        text={text}
        disabled={disabled || isSaving || isUploading}
        checkpoint={checkpoint}
        hasHighPriorityIssues={hasHighPriorityIssues}
        {...buttonProps}
      />
    </Tooltip>
  );
}

export default ButtonWithChecklistWarning;

ButtonWithChecklistWarning.propTypes = {
  disabled: PropTypes.bool,
  hasFutureDate: PropTypes.bool,
};
