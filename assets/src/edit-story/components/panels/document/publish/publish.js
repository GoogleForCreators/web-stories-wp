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
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { useConfig } from '../../../../app/config';
import { useAPI } from '../../../../app/api';
import { useFocusHighlight, states, styles } from '../../../../app/highlights';
import { Row, AdvancedDropDown, Label, Media, Required } from '../../../form';
import useInspector from '../../../inspector/useInspector';
import { Panel, PanelTitle, PanelContent } from '../../panel';
import { MEDIA_VARIANTS } from '../../../../../design-system/components/mediaInput/constants';
import PublishTime from './publishTime';

const LabelWrapper = styled.div`
  width: 106px;
`;

const FieldLabel = styled(Label)`
  flex-basis: ${({ width }) => (width ? width : '64px')};
`;

const MediaWrapper = styled.div`
  ${({ isHighlighted }) =>
    isHighlighted &&
    css`
      ${styles.OUTLINE}
      border-radius: 0;
    `}
  flex-basis: 134px;
`;

const HighlightRow = styled(Row)`
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    bottom: -10px;
    left: -20px;
    right: -10px;
    ${({ isHighlighted }) => isHighlighted && styles.FLASH}
    pointer-events: none;
  }
`;

function PublishPanel() {
  const {
    actions: { getAuthors },
  } = useAPI();
  const {
    state: { tab, users, isUsersLoading },
    actions: { loadUsers },
  } = useInspector();

  const posterButtonRef = useRef();
  const publisherLogoRef = useRef();

  const highlightPoster = useFocusHighlight(states.POSTER, posterButtonRef);
  const highlightLogo = useFocusHighlight(
    states.PUBLISHER_LOGO,
    publisherLogoRef
  );

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

  const {
    capabilities,
    allowedImageMimeTypes,
    allowedImageFileTypes,
  } = useConfig();

  const handleChangePoster = useCallback(
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

  const publisherLogoErrorMessage = useMemo(() => {
    return sprintf(
      /* translators: %s: list of allowed file types. */
      __('Please choose only %s as publisher logo.', 'web-stories'),
      allowedImageFileTypes.join(
        /* translators: delimiter used in a list */
        __(', ', 'web-stories')
      )
    );
  }, [allowedImageFileTypes]);

  const posterErrorMessage = useMemo(() => {
    /* translators: %s is a list of allowed file extensions. */
    return sprintf(
      /* translators: %s: list of allowed file types. */
      __('Please choose only %s as a poster.', 'web-stories'),
      allowedImageFileTypes.join(
        /* translators: delimiter used in a list */
        __(', ', 'web-stories')
      )
    );
  }, [allowedImageFileTypes]);

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
    <Panel
      name="publishing"
      collapsedByDefault={false}
      isPersistable={!(highlightLogo || highlightPoster)}
    >
      <PanelTitle>{__('Publishing', 'web-stories')}</PanelTitle>
      <PanelContent>
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
            <FieldLabel>{__('Publisher logo', 'web-stories')}</FieldLabel>
            <Required />
          </LabelWrapper>
          <MediaWrapper isHighlighted={highlightLogo?.showEffect}>
            <Media
              ref={publisherLogoRef}
              value={publisherLogoUrl}
              onChange={handleChangePublisherLogo}
              onChangeErrorText={publisherLogoErrorMessage}
              title={__('Select as publisher logo', 'web-stories')}
              buttonInsertText={__('Select as publisher logo', 'web-stories')}
              type={allowedImageMimeTypes}
              ariaLabel={__('Publisher logo', 'web-stories')}
              variant={MEDIA_VARIANTS.CIRCLE}
            />
          </MediaWrapper>
        </Row>
        <HighlightRow isHighlighted={highlightPoster?.showEffect}>
          <LabelWrapper>
            <FieldLabel>{__('Poster image', 'web-stories')}</FieldLabel>
            <Required />
          </LabelWrapper>
          <MediaWrapper isHighlighted={highlightPoster?.showEffect}>
            <Media
              ref={posterButtonRef}
              value={featuredMedia?.url}
              onChange={handleChangePoster}
              onChangeErrorText={posterErrorMessage}
              title={__('Select as poster image', 'web-stories')}
              buttonInsertText={__('Select as poster image', 'web-stories')}
              type={allowedImageMimeTypes}
              ariaLabel={__('Poster image', 'web-stories')}
            />
          </MediaWrapper>
        </HighlightRow>
      </PanelContent>
    </Panel>
  );
}

export default PublishPanel;
