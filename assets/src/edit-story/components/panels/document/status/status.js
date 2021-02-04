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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { useConfig } from '../../../../app/config';
import { Row, TextInput, HelperText, RadioGroup } from '../../../form';
import { SimplePanel } from '../../panel';

const BoxedTextInput = styled(TextInput)`
  padding: 6px 6px;
  border-radius: 4px;
  flex-grow: 1;
  &:focus {
    background-color: ${({ theme }) => theme.colors.fg.white};
  }
`;

function StatusPanel() {
  const { status = '', password, updateStory } = useStory(
    ({
      state: {
        story: { status, password },
      },
      actions: { updateStory },
    }) => ({ status, password, updateStory })
  );

  const { capabilities } = useConfig();

  const visibilityOptions = [
    {
      value: 'draft',
      name: __('Draft', 'web-stories'),
      helper: __('Visible to just me', 'web-stories'),
    },
  ];

  if (capabilities?.hasPublishAction) {
    visibilityOptions.push({
      value: 'publish',
      name: __('Public', 'web-stories'),
      helper: __('Visible to everyone', 'web-stories'),
    });
    visibilityOptions.push({
      value: 'private',
      name: __('Private', 'web-stories'),
      helper: __('Visible to site admins & editors only', 'web-stories'),
    });
  }

  const passwordProtected = 'protected';
  // @todo Add this back once we have FE implementation, too.
  /*visibilityOptions.push({
    name: __('Password Protected', 'web-stories'),
    value: passwordProtected,
  });*/

  // @todo this should still allow showing the moment where the warning is red, currently just doesn't allow adding more.
  const handleChangePassword = useCallback(
    (value) => {
      if (isValidPassword(value)) {
        updateStory({
          properties: { password: value },
        });
      }
    },
    [updateStory]
  );

  const isValidPassword = (value) => {
    return value && value.length <= 20;
  };

  const handleChangeVisibility = useCallback(
    (value) => {
      // If password protected but no password, do nothing.
      if (value === passwordProtected && !isValidPassword(password)) {
        return;
      }
      // If password protected, keep the previous status.
      const properties =
        passwordProtected === status
          ? { password }
          : {
              status: value,
              password: '',
            };
      updateStory({ properties });
    },
    [password, status, updateStory]
  );

  const getStatusValue = (value) => {
    // Always display protected visibility, independent of the status.
    if (password && password.length) {
      return passwordProtected;
    }
    // Display as public even if scheduled for future, private post can't be scheduled.
    if ('future' === value) {
      return 'publish';
    }
    return value;
  };

  return (
    <SimplePanel
      name="status"
      title={__('Status & Visibility', 'web-stories')}
      collapsedByDefault={false}
    >
      <>
        <Row>
          <RadioGroup
            options={visibilityOptions}
            onChange={handleChangeVisibility}
            value={getStatusValue(status)}
          />
        </Row>
        {passwordProtected === status && (
          <>
            <Row>
              <BoxedTextInput
                label={__('Password', 'web-stories')}
                value={password}
                onChange={handleChangePassword}
                placeholder={__('Enter a password', 'web-stories')}
              />
            </Row>
            <HelperText isWarning={password && password.length > 20}>
              {__('Must not exceed 20 characters', 'web-stories')}
            </HelperText>
          </>
        )}
      </>
    </SimplePanel>
  );
}

export default StatusPanel;
