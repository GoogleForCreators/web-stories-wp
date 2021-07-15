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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from '@wordpress/element';
import {
  ComboboxControl,
  SelectControl,
  Spinner,
  Button,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useDebounce } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import StoryPreview from './storyPreview';

const SORT_OPTIONS = [
  {
    label: __('Name', 'web-stories'),
    value: 'name',
  },
  {
    label: __('Date Created', 'web-stories'),
    value: 'date',
  },
  {
    label: __('Last Modified', 'web-stories'), // default
    value: 'modified',
  },
  {
    label: __('Created By', 'web-stories'),
    value: 'author',
  },
];

const {
  config: { maxNumOfStories },
} = window.webStoriesBlockSettings;

function SelectStories({
  stories = [],
  selectedStories = [],
  setSelectedStories,
  hasAllStories,
  isLoading,
  fetchStories,
}) {
  const [currentAuthor, setCurrentAuthor] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [authorKeyword, setAuthorKeyword] = useState('');
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('modified');
  const nextPage = useRef(1);

  const authors = useSelect(
    (select) => {
      // Not using `getUsers()` because it requires `list_users` capability.
      return select(coreStore).getAuthors({
        search: authorKeyword,
      });
    },
    [authorKeyword]
  );

  const fetchSelectedStories = useCallback(() => {
    fetchStories({
      author: currentAuthor?.id,
      search: searchKeyword,
      order,
      orderBy,
      page: nextPage.current,
    });
  }, [searchKeyword, currentAuthor, fetchStories, order, orderBy]);

  useEffect(() => {
    nextPage.current = 1;
    fetchSelectedStories();
  }, [searchKeyword, currentAuthor, order, orderBy, fetchSelectedStories]);

  const onLoadMoreClick = useCallback(() => {
    nextPage.current++;
    fetchSelectedStories();
  }, [fetchSelectedStories]);

  const debouncedTypeaheadChange = useDebounce((value) => {
    setSearchKeyword(value);
  }, 300);

  const debouncedTypeaheadAuthorChange = useDebounce((value) => {
    // Set the user input as the current search keyword.
    setAuthorKeyword(value);

    // On selecting author from the dropdown, '<Search />' component sets the value from the
    // suggestions array, which in our case is author ID. Check the value is a number.
    if (value.length > 0 && !isNaN(value)) {
      setCurrentAuthor(
        authors.filter((author) => author.id === parseInt(value))
      );
    }

    if ('' === value) {
      setCurrentAuthor({
        id: 0,
        name: '',
      });
    }
  }, 300);

  const handleAuthorChange = useCallback(
    (newOption) => {
      // On selecting author from the dropdown, '<Search />' component sets the newOption from the
      // suggestions array, which in our case is author ID. Check the newOption is a number.
      if (newOption) {
        setCurrentAuthor(
          authors.filter((author) => author.id === parseInt(newOption))
        );
      }

      if ('' === newOption) {
        setCurrentAuthor({
          id: 0,
          name: '',
        });
      }
    },
    [authors, setCurrentAuthor]
  );

  const onSortChange = useCallback(
    (newSort) => {
      setOrderBy(newSort);
      setOrder(['title', 'author'].includes(newSort) ? 'asc' : 'desc');
    },
    [setOrder, setOrderBy]
  );

  const authorSearchOptions = useMemo(() => {
    return authors
      .filter(({ name }) => Boolean(name?.trim().length))
      .map(({ id, name }) => ({
        label: name,
        value: id.toString(),
      }));
  }, [authors]);

  const storiesSearchOptions = useMemo(() => {
    return stories
      .filter(({ title }) => Boolean(title?.rendered?.trim()?.length))
      .map(({ id, title }) => ({
        label: title.rendered,
        value: id.toString(),
      }));
  }, [stories]);

  const selectedStoryIds = useMemo(
    () => selectedStories.map((story) => story.id),
    [selectedStories]
  );

  const addSelectedStory = useCallback(
    (newStory) => {
      if (selectedStories.length >= maxNumOfStories) {
        return;
      }

      if (selectedStoryIds.includes(newStory.id)) {
        return;
      }

      setSelectedStories([...selectedStories, newStory]);
    },
    [setSelectedStories, selectedStories, selectedStoryIds]
  );

  const removeSelectedStory = useCallback(
    (story) => {
      setSelectedStories(
        selectedStories.filter((_story) => _story.id !== story.id)
      );
    },
    [selectedStories, setSelectedStories]
  );

  return (
    <>
      <div className="web-stories-story-picker-filter">
        <div className="web-stories-story-picker-filter__search-container">
          <div className="web-stories-story-picker-filter__search-inner">
            <ComboboxControl
              label={__('Search Stories', 'web-stories')}
              options={storiesSearchOptions}
              onFilterValueChange={debouncedTypeaheadChange}
              allowReset={false}
              value={searchKeyword}
            />
          </div>
          <ComboboxControl
            label={__('Search by Author', 'web-stories')}
            options={authorSearchOptions}
            onFilterValueChange={debouncedTypeaheadAuthorChange}
            onChange={handleAuthorChange}
            allowReset={false}
            value={currentAuthor}
          />
          <div>
            <SelectControl
              label={__('Sort', 'web-stories')}
              options={SORT_OPTIONS}
              value={orderBy}
              onChange={onSortChange}
            />
          </div>
        </div>
      </div>
      {!stories.length && searchKeyword && (
        <p>
          {sprintf(
            /* translators: %s: search term. */
            __(
              `Sorry, we couldn't find any results matching "%s"`,
              'web-stories'
            ),
            searchKeyword
          )}
        </p>
      )}
      {!stories.length && !searchKeyword && (
        <p>{__(`Sorry, we couldn't find any results`, 'web-stories')}</p>
      )}
      {stories.length >= 1 && (
        <div
          role="list"
          aria-label={__('Viewing Stories', 'web-stories')}
          className="web-stories-story-picker-filter__grid"
        >
          {stories.map((story) => {
            const isSelected = selectedStoryIds.includes(story.id);

            return (
              <div
                key={story.id}
                role="listitem"
                className="web-stories-story-picker-filter__grid_item"
              >
                <StoryPreview
                  story={story}
                  isSelected={isSelected}
                  addSelectedStory={addSelectedStory}
                  removeSelectedStory={removeSelectedStory}
                />
              </div>
            );
          })}
        </div>
      )}
      <div className="web-stories-story-picker-filter__Load_more">
        {isLoading && <Spinner />}
        {!hasAllStories && stories.length > 0 && (
          <Button
            variant="primary"
            className="is-primary"
            onClick={onLoadMoreClick}
          >
            {__('Load More', 'web-stories')}
          </Button>
        )}
      </div>
    </>
  );
}

SelectStories.propTypes = {
  stories: PropTypes.array,
  selectedStories: PropTypes.array,
  setSelectedStories: PropTypes.func,
  hasAllStories: PropTypes.bool,
  isLoading: PropTypes.bool,
  fetchStories: PropTypes.func,
};

export default SelectStories;
