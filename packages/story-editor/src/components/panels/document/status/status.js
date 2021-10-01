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
import { useCallback, useEffect, useState } from '@web-stories-wp/react';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import { Input, Text, THEME_CONSTANTS } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { Row, RadioGroup } from '../../../form';
import { SimplePanel } from '../../panel';

const InputRow = styled(Row)`
  margin-left: 34px;
`;

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function StatusPanel() {
  const {
    status = '',
    password: savedPassword,
    updateStory,
    capabilities,
  } = useStory(
    ({
      state: {
        story: { status, password },
        capabilities,
      },
      actions: { updateStory },
    }) => ({ status, password, updateStory, capabilities })
  );
  const [password, setPassword] = useState(savedPassword);

  useEffect(() => {
    // updated displayed password when stored password is updated
    setPassword(savedPassword);
  }, [savedPassword]);

  const visibilityOptions = [
    {
      value: 'draft',
      label: __('Draft', 'web-stories'),
      helper: __('Visible to just me', 'web-stories'),
    },
  ];

  if (capabilities?.publish) {
    visibilityOptions.push({
      value: 'publish',
      label: __('Public', 'web-stories'),
      helper: __('Visible to everyone', 'web-stories'),
    });
    visibilityOptions.push({
      value: 'private',
      label: __('Private', 'web-stories'),
      helper: __('Visible to site admins & editors only', 'web-stories'),
    });
  }

  const passwordProtected = 'protected';
  // @todo Add this back once we have FE implementation, too.
  /*visibilityOptions.push({
    label: __('Password Protected', 'web-stories'),
    value: passwordProtected,
    helper: __('Need password to view', 'web-stories'),
  });*/

  const handleChangePassword = useCallback((evt) => {
    setPassword(evt.target.value);
  }, []);

  // @todo this should still allow showing the moment where the warning is red, currently just doesn't allow adding more.
  const handleUpdatePassword = useCallback(
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
    (evt) => {
      // If password protected but no password, do nothing.
      if (
        evt.target.value === passwordProtected &&
        !isValidPassword(password)
      ) {
        return;
      }
      // If password protected, keep the previous status.
      const properties =
        passwordProtected === status
          ? { password }
          : {
              status: evt.target.value,
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
      title={__('Status and visibility', 'web-stories')}
      collapsedByDefault={false}
    >
      <>
        <Row>
          <HelperText>
            {__('Set the current status of your story to', 'web-stories')}
          </HelperText>
        </Row>
        <Row>
          <RadioGroup
            groupLabel="Visibility"
            name="radio-group-visibility"
            options={visibilityOptions}
            onChange={handleChangeVisibility}
            value={getStatusValue(status)}
          />
        </Row>
        {passwordProtected === status && (
          <InputRow>
            <Input
              aria-label={__('Password', 'web-stories')}
              value={password}
              onBlur={handleUpdatePassword}
              onChange={handleChangePassword}
              placeholder={__('Enter a password', 'web-stories')}
            />
          </InputRow>
        )}
      </>
    </SimplePanel>
  );
}

export default StatusPanel;
