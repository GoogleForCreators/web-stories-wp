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
import { useCallback, useEffect } from 'react';
import { rgba } from 'polished';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import { SimplePanel } from '../../panels/panel';
import { Button, TextInput, Row, DropDown } from '../../form';
import useInspector from '../useInspector';
import { PublishPanel } from '../../panels';

const BoxedTextInput = styled(TextInput)`
  padding: 6px 6px;
  border-radius: 4px;
  flex-grow: 1;
  &:focus {
    background-color: #fff;
  }
`;

const HelperRow = styled(Row)`
  margin-top: -10px;
`;

// @todo Use theme instead of color directly.
const Permalink = styled.a`
  color: #4285f4;
`;

// @todo replace color with theme code.
const Helper = styled.span`
  color: ${({ theme, warning }) =>
    warning ? '#EA4335' : rgba(theme.colors.fg.v1, 0.54)};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: 12px;
  line-height: 16px;
`;

function DocumentInspector() {
  const {
    actions: { loadStatuses, loadUsers },
    state: { statuses },
  } = useInspector();

  const {
    state: {
      meta: { isSaving },
      story: { status, slug, password, link },
      capabilities,
    },
    actions: { updateStory, deleteStory },
  } = useStory();

  useEffect(() => {
    loadStatuses();
    loadUsers();
  });

  const passwordProtected = 'protected';
  const visibilityOptions = statuses.filter(({ value }) =>
    ['draft', 'publish', 'private'].includes(value)
  );

  // @todo Add this back once we have FE implementation, too.
  /*visibilityOptions.push({
    name: __('Password Protected', 'web-stories'),
    value: passwordProtected,
  });*/

  const handleChangeValue = useCallback(
    (prop) => (value) => updateStory({ properties: { [prop]: value } }),
    [updateStory]
  );

  // @todo this should still allow showing the moment where the warning is red, currently just doesn't allow adding more.
  const handleChangePassword = useCallback(
    (value) => {
      if (value.length <= 20) {
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

  // @todo Design details.
  const handleChangeVisibility = useCallback(
    (value) => {
      // If password protected but no password, do nothing.
      if (value === passwordProtected && !isValidPassword(value)) {
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

  const handleRemoveStory = useCallback(
    (evt) => {
      deleteStory();
      evt.preventDefault();
    },
    [deleteStory]
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
    <>
      <SimplePanel
        name="status"
        title={__('Status & Visibility', 'web-stories')}
      >
        {capabilities && capabilities.hasPublishAction && statuses && (
          <>
            <Row>
              <DropDown
                ariaLabel={__('Visibility', 'web-stories')}
                options={visibilityOptions}
                disabled={isSaving}
                value={getStatusValue(status)}
                onChange={handleChangeVisibility}
                isDocumentPanel={true}
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
                <HelperRow>
                  <Helper warning={password && password.length > 20}>
                    {__('Must not exceed 20 characters', 'web-stories')}
                  </Helper>
                </HelperRow>
              </>
            )}
          </>
        )}
        <Button onClick={handleRemoveStory} fullWidth>
          {__('Move to trash', 'web-stories')}
        </Button>
      </SimplePanel>
      <PublishPanel />
      <SimplePanel name="permalink" title={__('Permalink', 'web-stories')}>
        <Row>
          <BoxedTextInput
            label={__('URL Slug', 'web-stories')}
            value={slug}
            onChange={handleChangeValue('slug')}
            placeholder={__('Enter slug', 'web-stories')}
          />
        </Row>
        <HelperRow>
          <Helper>
            <Permalink rel="noopener noreferrer" target="_blank" href={link}>
              {link}
            </Permalink>
          </Helper>
        </HelperRow>
      </SimplePanel>
    </>
  );
}

export default DocumentInspector;
