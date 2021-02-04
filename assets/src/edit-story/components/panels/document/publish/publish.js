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
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { useConfig } from '../../../../app/config';
import { useAPI } from '../../../../app/api';
import { Row, AdvancedDropDown, Label, Media, Required } from '../../../form';
import useInspector from '../../../inspector/useInspector';
import { Panel, PanelTitle, PanelContent } from '../../panel';
import PublishTime from './publishTime';

const LabelWrapper = styled.div`
  width: 106px;
`;

const FieldLabel = styled(Label)`
  flex-basis: ${({ width }) => (width ? width : '64px')};
`;

const MediaWrapper = styled.div`
  flex-basis: 134px;
`;

function PublishPanel() {
  const {
    actions: { getAuthors },
  } = useAPI();
  const {
    state: { tab, users, isUsersLoading },
    actions: { loadUsers },
  } = useInspector();

  const {
    isSaving,
    author,
    featuredMedia,
    publisherLogoUrl,
    updateStory,
  } = useStory(
    ({
      state: {
        meta: { isSaving },
        story: {
          author = {},
          featuredMedia = { id: 0, url: '', height: 0, width: 0 },
          publisherLogoUrl = '',
        },
      },
      actions: { updateStory },
    }) => {
      return {
        isSaving,
        author,
        featuredMedia,
        publisherLogoUrl,
        updateStory,
      };
    }
  );

  const [queriedUsers, setQueriedUsers] = useState(null);
  const [visibleOptions, setVisibleOptions] = useState(null);

  useEffect(() => {
    if (tab === 'document') {
      loadUsers();
    }
  }, [tab, loadUsers]);

  const { capabilities } = useConfig();

  const handleChangeCover = useCallback(
    (image) =>
      updateStory({
        properties: {
          featuredMedia: {
            id: image.id,
            height: image.sizes?.full?.height || image.height,
            url: image.sizes?.full?.url || image.url,
            width: image.sizes?.full?.width || image.width,
          },
        },
      }),
    [updateStory]
  );

  const getAuthorsBySearch = useCallback(
    (search) => {
      return getAuthors(search).then((data) => {
        const userData = data.map(({ id, name }) => ({
          id,
          name,
        }));
        setQueriedUsers(userData);
      });
    },
    [getAuthors]
  );

  // @todo Enforce square image while selecting in Media Library.
  const handleChangePublisherLogo = useCallback(
    (image) => {
      updateStory({
        properties: {
          publisherLogo: image.id,
          publisherLogoUrl: image.sizes?.thumbnail?.url || image.url,
        },
      });
    },
    [updateStory]
  );

  useEffect(() => {
    if (users?.length) {
      const currentAuthor = users.find(({ id }) => author.id === id);
      if (!currentAuthor) {
        setVisibleOptions([author, ...users]);
      } else {
        setVisibleOptions(users);
      }
    }
  }, [author, users]);

  const handleChangeAuthor = useCallback(
    ({ id, name }) => {
      updateStory({
        properties: { author: { id, name } },
      });
    },
    [updateStory]
  );

  const authorLabelId = `author-label-${uuidv4()}`;
  const dropDownParams = {
    hasSearch: true,
    'aria-labelledby': authorLabelId,
    lightMode: true,
    onChange: handleChangeAuthor,
    getOptionsByQuery: getAuthorsBySearch,
    selectedId: author.id,
  };
  return (
    <Panel name="publishing" collapsedByDefault={false}>
      <PanelTitle>{__('Publishing', 'web-stories')}</PanelTitle>
      <PanelContent padding={'10px 10px 10px 20px'}>
        <PublishTime />
        {capabilities && capabilities.hasAssignAuthorAction && users && (
          <Row>
            <FieldLabel id={authorLabelId}>
              {__('Author', 'web-stories')}
            </FieldLabel>
            {isUsersLoading || !visibleOptions ? (
              <AdvancedDropDown
                placeholder={__('Loading…', 'web-stories')}
                disabled
                primaryOptions={[]}
                {...dropDownParams}
              />
            ) : (
              <AdvancedDropDown
                options={queriedUsers}
                primaryOptions={visibleOptions}
                searchResultsLabel={__('Search results', 'web-stories')}
                disabled={isSaving}
                {...dropDownParams}
              />
            )}
          </Row>
        )}
        <Row>
          {/* @todo Replace this with selection to choose between publisher logos */}
          <LabelWrapper>
            <FieldLabel>{__('Publisher Logo', 'web-stories')}</FieldLabel>
            <Required />
          </LabelWrapper>
          <MediaWrapper>
            <Media
              value={publisherLogoUrl}
              onChange={handleChangePublisherLogo}
              title={__('Select as publisher logo', 'web-stories')}
              buttonInsertText={__('Select as publisher logo', 'web-stories')}
              type={'image'}
              size={80}
              ariaLabel={__('Publisher logo', 'web-stories')}
            />
          </MediaWrapper>
        </Row>
        <Row>
          <LabelWrapper>
            <FieldLabel>{__('Cover Image', 'web-stories')}</FieldLabel>
            <Required />
          </LabelWrapper>
          <MediaWrapper>
            <Media
              value={featuredMedia?.url}
              onChange={handleChangeCover}
              title={__('Select as cover image', 'web-stories')}
              buttonInsertText={__('Select as cover image', 'web-stories')}
              type={'image'}
              ariaLabel={__('Cover image', 'web-stories')}
            />
          </MediaWrapper>
        </Row>
      </PanelContent>
    </Panel>
  );
}

export default PublishPanel;
