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
import { useCallback, useMemo, useState } from '@web-stories-wp/react';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import { Input } from '@web-stories-wp/design-system';
import { trackEvent } from '@web-stories-wp/tracking';
import {
  Row,
  RadioGroup,
  SimplePanel,
  ReviewChecklistDialog,
  useStory,
  useCheckpoint,
  useRefreshPostEditURL,
} from '@web-stories-wp/story-editor';

const InputRow = styled(Row)`
  margin-left: 34px;
`;

function StatusPanel() {
  const {
    status = '',
    password,
    updateStory,
    capabilities,
    editLink,
    title,
    storyId,
  } = useStory(
    ({
      state: {
        story: { status, password, editLink, title, storyId },
        capabilities,
      },
      actions: { updateStory },
    }) => ({
      status,
      password,
      updateStory,
      capabilities,
      editLink,
      title,
      storyId,
    })
  );

  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const closeReviewDialog = useCallback(() => setShowReviewDialog(false), []);

  const { shouldReviewDialogBeSeen } = useCheckpoint(
    ({ state: { shouldReviewDialogBeSeen } }) => ({
      shouldReviewDialogBeSeen,
    })
  );

  const [hasPassword, setHasPassword] = useState(Boolean(password));

  const visibility = useMemo(() => {
    if (hasPassword) {
      return 'protected';
    }

    if (status === 'private') {
      return 'private';
    }

    return 'public';
  }, [status, hasPassword]);

  const visibilityOptions = [
    {
      value: 'public',
      label: __('Public', 'web-stories'),
      helper: __('Visible to everyone', 'web-stories'),
    },
  ];

  if (capabilities?.publish) {
    visibilityOptions.push({
      value: 'private',
      label: __('Private', 'web-stories'),
      helper: __('Visible to site admins & editors only', 'web-stories'),
    });
    visibilityOptions.push({
      value: 'protected',
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
      status: 'private',
      password: '',
    };
    setHasPassword(false);

    trackEvent('publish_story', {
      status: 'private',
      title_length: title.length,
    });
    refreshPostEditURL();

    updateStory({ properties });
  }, [setHasPassword, title.length, refreshPostEditURL, updateStory]);

  const handleChangeVisibility = useCallback(
    (evt) => {
      const newVisibility = evt.target.value;

      if ('private' === newVisibility) {
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
        case 'public':
          properties.status = visibility === 'private' ? 'draft' : status;
          properties.password = '';
          setHasPassword(false);
          break;

        case 'private':
          if (shouldReviewDialogBeSeen) {
            setShowReviewDialog(true);
          } else {
            publishPrivately();
          }
          return;

        case 'protected':
          properties.status = visibility === 'private' ? 'draft' : status;
          properties.password = password || '';
          setHasPassword(true);
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
      setHasPassword,
      updateStory,
      publishPrivately,
      shouldReviewDialogBeSeen,
    ]
  );

  return (
    <>
      <SimplePanel
        name="status"
        title={__('Visibility', 'web-stories')}
        collapsedByDefault={false}
      >
        <>
          <Row>
            <RadioGroup
              groupLabel="Visibility"
              name="radio-group-visibility"
              options={visibilityOptions}
              onChange={handleChangeVisibility}
              value={visibility}
            />
          </Row>
          {hasPassword && (
            <InputRow>
              <Input
                aria-label={__('Password', 'web-stories')}
                value={password}
                onChange={handleChangePassword}
                placeholder={__('Enter a password', 'web-stories')}
              />
            </InputRow>
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
