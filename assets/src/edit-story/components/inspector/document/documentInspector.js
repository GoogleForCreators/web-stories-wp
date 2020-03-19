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
import { useConfig } from '../../../app/config';
import { SimplePanel } from '../../panels/panel';
import { useMediaPicker } from '../../mediaPicker';
import { InputGroup, Button, TextInput, Row } from '../../form';
import DropDown from '../../dropDown';
import useInspector from '../useInspector';

const Img = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: contain;
`;

const BoxedTextInput = styled(TextInput)`
  padding: 6px 6px;
  border-radius: 4px;
  flex-grow: 1;
  &:focus {
    background-color: #fff;
  }
`;

const LabelRow = styled(Row)`
  margin-top: -10px;
`;

// @todo Use theme instead of color directly.
const Permalink = styled.a`
  color: #4285f4;
`;

// @todo replace color with theme code.
const Label = styled.span`
  color: ${({ theme, warning }) =>
    warning ? '#EA4335' : rgba(theme.colors.fg.v1, 0.54)};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: 12px;
  line-height: 16px;
`;

function DocumentInspector() {
  const {
    actions: { loadStatuses, loadUsers },
    state: { users, statuses },
  } = useInspector();

  const {
    state: {
      meta: { isSaving },
      story: { author, status, slug, date, featuredMediaUrl, password, link },
      capabilities,
    },
    actions: { updateStory, deleteStory },
  } = useStory();

  const { postThumbnails } = useConfig();

  useEffect(() => {
    loadStatuses();
    loadUsers();
  });

  const passwordProtected = 'protected';
  const visibilityOptions = statuses.filter(({ value }) =>
    ['draft', 'publish', 'private'].includes(value)
  );

  visibilityOptions.push({
    name: __('Password Protected', 'web-stories'),
    value: passwordProtected,
  });

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
              password: null,
            };
      updateStory({ properties });
    },
    [password, status, updateStory]
  );

  const handleChangeImage = useCallback(
    (image) =>
      updateStory({
        properties: {
          featuredMedia: image.id,
          featuredMediaUrl: image.sizes?.medium?.url || image.url,
        },
      }),
    [updateStory]
  );

  const handleRemoveImage = useCallback(
    (evt) => {
      updateStory({ properties: { featuredMedia: 0, featuredMediaUrl: '' } });
      evt.preventDefault();
    },
    [updateStory]
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

  const openMediaPicker = useMediaPicker({
    title: __('Select as featured image', 'web-stories'),
    buttonInsertText: __('Set as featured image', 'web-stories'),
    onSelect: handleChangeImage,
    type: 'image',
  });

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
              />
            </Row>
            {
              <>
                <Row>
                  <BoxedTextInput
                    label={__('Password', 'web-stories')}
                    value={password}
                    onChange={handleChangePassword}
                    placeholder={__('Enter a password', 'web-stories')}
                  />
                </Row>
                <LabelRow>
                  <Label warning={password && password.length > 20}>
                    {__('Must not exceed 20 characters', 'web-stories')}
                  </Label>
                </LabelRow>
              </>
            }
          </>
        )}
        <Button onClick={handleRemoveStory} fullWidth>
          {__('Move to trash', 'web-stories')}
        </Button>
      </SimplePanel>
      <SimplePanel name="publishing" title={__('Publishing', 'web-stories')}>
        <InputGroup
          label={__('Publish', 'web-stories')}
          type={'datetime-local'}
          value={date}
          disabled={isSaving}
          onChange={handleChangeValue('date')}
        />
        {capabilities && capabilities.hasAssignAuthorAction && users && (
          <DropDown
            ariaLabel={__('Author', 'web-stories')}
            options={users}
            value={author}
            disabled={isSaving}
            onChange={handleChangeValue('author')}
          />
        )}
        {featuredMediaUrl && <Img src={featuredMediaUrl} />}
        {featuredMediaUrl && (
          <Button onClick={handleRemoveImage} fullWidth>
            {__('Remove image', 'web-stories')}
          </Button>
        )}

        {postThumbnails && (
          <Button onClick={openMediaPicker} fullWidth>
            {featuredMediaUrl
              ? __('Replace image', 'web-stories')
              : __('Set featured image', 'web-stories')}
          </Button>
        )}
      </SimplePanel>
      <SimplePanel name="permalink" title={__('Permalink', 'web-stories')}>
        <Row>
          <BoxedTextInput
            label={__('URL Slug', 'web-stories')}
            value={slug}
            onChange={handleChangeValue('slug')}
            placeholder={__('Enter slug', 'web-stories')}
          />
        </Row>
        <LabelRow>
          <Label>
            <Permalink rel="noopener noreferrer" target="_blank" href={link}>
              {link}
            </Permalink>
          </Label>
        </LabelRow>
      </SimplePanel>
    </>
  );
}

export default DocumentInspector;
