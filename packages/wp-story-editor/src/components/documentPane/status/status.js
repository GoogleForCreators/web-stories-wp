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
import { useCallback, useEffect, useState } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { Input, DropDown } from '@googleforcreators/design-system';
import { trackEvent } from '@googleforcreators/tracking';
import {
  Row,
  SimplePanel,
  ReviewChecklistDialog,
  useStory,
  useCheckpoint,
  useRefreshPostEditURL,
  useIsUploadingToStory,
} from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import { VISIBILITY, STATUS } from '../../../constants';

function StatusPanel({
  nameOverride,
  popupZIndex,
  canCollapse,
  isPersistable,
  ...rest
}) {
  const {
    status = '',
    password,
    updateStory,
    saveStory,
    capabilities,
    editLink,
    title,
    storyId,
    visibility,
  } = useStory(
    ({
      state: {
        story: { status, password, editLink, title, storyId, visibility },
        capabilities,
      },
      actions: { updateStory, saveStory },
    }) => ({
      status,
      password,
      updateStory,
      saveStory,
      capabilities,
      editLink,
      title,
      storyId,
      visibility,
    })
  );

  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const closeReviewDialog = useCallback(() => setShowReviewDialog(false), []);

  const { shouldReviewDialogBeSeen } = useCheckpoint(
    ({ state: { shouldReviewDialogBeSeen } }) => ({
      shouldReviewDialogBeSeen,
    })
  );

  const isUploading = useIsUploadingToStory();

  useEffect(() => {
    if (password) {
      updateStory({
        properties: { visibility: VISIBILITY.PASSWORD_PROTECTED },
      });
      return;
    }

    if (status === STATUS.PRIVATE) {
      updateStory({
        properties: { visibility: VISIBILITY.PRIVATE },
      });
      return;
    }

    updateStory({
      properties: { visibility: VISIBILITY.PUBLIC },
    });
  }, [password, status, updateStory]);

  const visibilityOptions = [
    {
      value: VISIBILITY.PUBLIC,
      label: __('Public', 'web-stories'),
      helper: __('Visible to everyone', 'web-stories'),
    },
  ];

  if (capabilities?.publish) {
    visibilityOptions.push({
      value: VISIBILITY.PRIVATE,
      label: __('Private', 'web-stories'),
      helper: __('Visible to site admins & editors only', 'web-stories'),
      disabled: isUploading && visibility !== VISIBILITY.PRIVATE,
    });
    visibilityOptions.push({
      value: VISIBILITY.PASSWORD_PROTECTED,
      label: __('Password Protected', 'web-stories'),
      helper: __('Visible only to those with the password.', 'web-stories'),
    });
  }

  const handleChangePassword = useCallback(
    (evt) => {
      updateStory({
        properties: { password: evt.target.value },
      });
    },
    [updateStory]
  );

  const refreshPostEditURL = useRefreshPostEditURL(storyId, editLink);

  const publishPrivately = useCallback(() => {
    const properties = {
      status: STATUS.PRIVATE,
      password: '',
      visibility: VISIBILITY.PRIVATE,
    };

    trackEvent('publish_story', {
      status: STATUS.PRIVATE,
      title_length: title.length,
    });
    refreshPostEditURL();

    saveStory(properties);
  }, [title.length, refreshPostEditURL, saveStory]);

  const isAlreadyPublished = [
    STATUS.PUBLISH,
    STATUS.FUTURE,
    STATUS.PRIVATE,
  ].includes(status);

  const handleChangeVisibility = useCallback(
    (_, value) => {
      const newVisibility = value;

      if (VISIBILITY.PRIVATE === newVisibility && !isAlreadyPublished) {
        if (
          !window.confirm(
            __(
              'Would you like to privately publish this story now?',
              'web-stories'
            )
          )
        ) {
          return;
        }
      }

      const properties = {};

      switch (newVisibility) {
        case VISIBILITY.PUBLIC:
          properties.status =
            visibility === VISIBILITY.PRIVATE ? STATUS.DRAFT : status;
          properties.password = '';
          properties.visibility = VISIBILITY.PUBLIC;
          break;

        case VISIBILITY.PRIVATE:
          if (shouldReviewDialogBeSeen && !isAlreadyPublished) {
            setShowReviewDialog(true);
            properties.visibility = VISIBILITY.PRIVATE;
          } else {
            publishPrivately();
          }
          return;

        case VISIBILITY.PASSWORD_PROTECTED:
          properties.status =
            visibility === VISIBILITY.PRIVATE ? STATUS.DRAFT : status;
          properties.password = password || '';
          properties.visibility = VISIBILITY.PASSWORD_PROTECTED;
          break;

        default:
          break;
      }

      updateStory({ properties });
    },
    [
      status,
      visibility,
      password,
      updateStory,
      publishPrivately,
      shouldReviewDialogBeSeen,
      isAlreadyPublished,
    ]
  );

  return (
    <>
      <SimplePanel
        name={nameOverride || 'status'}
        title={__('Visibility', 'web-stories')}
        canCollapse={canCollapse}
        isPersistable={isPersistable}
        collapsedByDefault={false}
        {...rest}
      >
        <>
          <Row>
            <DropDown
              options={visibilityOptions}
              selectedValue={visibility}
              onMenuItemClick={handleChangeVisibility}
              popupZIndex={popupZIndex}
              hint={
                visibilityOptions.find((option) => visibility === option.value)
                  ?.helper
              }
              disabled={visibilityOptions.length <= 1}
            />
          </Row>
          {visibility === VISIBILITY.PASSWORD_PROTECTED && (
            <Row>
              <Input
                aria-label={__('Password', 'web-stories')}
                value={password}
                onChange={handleChangePassword}
                placeholder={__('Enter a password', 'web-stories')}
              />
            </Row>
          )}
        </>
      </SimplePanel>
      <ReviewChecklistDialog
        isOpen={showReviewDialog}
        onIgnore={publishPrivately}
        onClose={closeReviewDialog}
        onReview={closeReviewDialog}
      />
    </>
  );
}

export default StatusPanel;

StatusPanel.propTypes = {
  nameOverride: PropTypes.string,
  popupZIndex: PropTypes.number,
  canCollapse: PropTypes.bool,
  isPersistable: PropTypes.bool,
};
