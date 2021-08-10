/*
 * Copyright 2021 Google LLC
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
import { useCallback, useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import { AdvancedDropDown, Row } from '../../../form';
import { useStory } from '../../../../app/story';
import { useAPI } from '../../../../app/api';
import useInspector from '../../../inspector/useInspector';

function Author() {
  const {
    actions: { getAuthors },
  } = useAPI();
  const {
    state: { tab, users, isUsersLoading },
    actions: { loadUsers },
  } = useInspector();
  const { isSaving, author, updateStory } = useStory(
    ({
      state: {
        meta: { isSaving },
        story: { author = {} },
      },
      actions: { updateStory },
    }) => {
      return {
        isSaving,
        author,
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

  const isLoading = isUsersLoading || !visibleOptions;
  const dropDownParams = {
    hasSearch: true,
    lightMode: true,
    onChange: handleChangeAuthor,
    getOptionsByQuery: getAuthorsBySearch,
    selectedId: author.id,
    dropDownLabel: __('Author', 'web-stories'),
    placeholder: isLoading ? __('Loading…', 'web-stories') : '',
    disabled: isLoading ? true : isSaving,
    primaryOptions: isLoading ? [] : visibleOptions,
  };
  return (
    <Row>
      <AdvancedDropDown
        options={queriedUsers}
        searchResultsLabel={__('Search results', 'web-stories')}
        aria-label={__('Author', 'web-stories')}
        {...dropDownParams}
      />
    </Row>
  );
}

export default Author;
