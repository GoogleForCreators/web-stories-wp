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
import { __, _n, sprintf } from '@wordpress/i18n';
import { Button, Modal } from '@wordpress/components';
import { useState, useEffect, useCallback } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import LoaderContainer from '../loaderContainer';
import SelectStories from './selectStories';
import SortStories from './sortStories';

const {
  config: {
    api: { stories: storiesApi },
  },
} = window.webStoriesBlockSettings;

function StoryPicker({
  selectedStories,
  setSelectedStories,
  closeStoryPicker,
  isSortingStories = false,
  setIsSortingStories = () => {},
  maxNumOfStories,
}) {
  const { createErrorNotice } = useDispatch(noticesStore);

  const [localSelectedStories, setLocalSelectedStories] =
    useState(selectedStories);

  const [isFetchingForFirstTime, setIsFetchingForFirstTime] = useState(true);

  const [loadingState, setLoadingState] = useState('idle');
  const [stories, setStories] = useState([]);
  const [hasAllStories, setHasAllStories] = useState([]);

  const saveChanges = useCallback(() => {
    closeStoryPicker();
    setSelectedStories(localSelectedStories);
  }, [closeStoryPicker, setSelectedStories, localSelectedStories]);

  const fetchStories = useCallback(
    async ({
      orderby = 'modified',
      order = 'desc',
      search = undefined,
      author = undefined,
      page = 1,
    } = {}) => {
      const query = {
        _embed: 'author,wp:featuredmedia',
        context: 'edit',
        _web_stories_envelope: true,
        search,
        author,
        page,
        per_page: 10,
        orderby,
        order,
        status: 'publish',
      };

      try {
        setLoadingState('loading');
        const response = await apiFetch({
          path: addQueryArgs(storiesApi, query),
        });

        const totalPages = Number(response?.headers?.['X-WP-TotalPages']);

        setHasAllStories(page === totalPages);
        setStories((existingStories) =>
          page === 1 ? response.body : [...existingStories, ...response.body]
        );
      } catch (err) {
        setLoadingState('error');
        createErrorNotice(__('Unable to load stories', 'web-stories'), {
          type: 'snackbar',
        });
      } finally {
        setLoadingState('idle');
        setIsFetchingForFirstTime(false);
      }
    },
    [createErrorNotice]
  );

  useEffect(() => {
    if (isFetchingForFirstTime) {
      fetchStories();
    }
  }, [isFetchingForFirstTime, fetchStories]);

  const title =
    maxNumOfStories === 1
      ? __('Selected Story', 'web-stories')
      : __('Selected Stories', 'web-stories');

  return (
    <Modal
      title={title}
      onRequestClose={closeStoryPicker}
      shouldCloseOnClickOutside={false}
      className="web-stories-story-picker-modal"
    >
      <div className="web-stories-story-picker-modal__content">
        {isFetchingForFirstTime ? (
          <LoaderContainer>
            {__('Loading Stories…', 'web-stories')}
          </LoaderContainer>
        ) : isSortingStories ? (
          <SortStories
            selectedStories={localSelectedStories}
            setSelectedStories={setLocalSelectedStories}
          />
        ) : (
          <SelectStories
            stories={stories}
            selectedStories={localSelectedStories}
            setSelectedStories={setLocalSelectedStories}
            hasAllStories={hasAllStories}
            fetchStories={fetchStories}
            maxNumOfStories={maxNumOfStories}
            isLoading={loadingState === 'loading'}
          />
        )}
      </div>
      <div className="web-stories-story-picker-modal__footer">
        <div className="web-stories-story-picker-modal__footer--left">
          {!isSortingStories && !isFetchingForFirstTime && maxNumOfStories > 1 && (
            <p>
              {sprintf(
                /* translators: %1$d: Number of selected stories, %2$d: Maximum allowed stories */
                _n(
                  '%1$d of %2$d story selected',
                  '%1$d of %2$d stories selected',
                  maxNumOfStories,
                  'web-stories'
                ),
                localSelectedStories.length,
                maxNumOfStories
              )}
            </p>
          )}
        </div>
        <div className="web-stories-story-picker-modal__footer--right">
          {maxNumOfStories > 1 &&
            (isSortingStories ? (
              <Button onClick={() => setIsSortingStories(false)}>
                {__('Select Stories', 'web-stories')}
              </Button>
            ) : (
              <Button
                onClick={() => setIsSortingStories(true)}
                disabled={localSelectedStories.length < 2}
              >
                {__('Rearrange Stories', 'web-stories')}
              </Button>
            ))}
          <Button
            isPrimary
            disabled={!localSelectedStories.length}
            onClick={saveChanges}
          >
            {__('Update', 'web-stories')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

StoryPicker.propTypes = {
  selectedStories: PropTypes.array,
  setSelectedStories: PropTypes.func,
  closeStoryPicker: PropTypes.func,
  isSortingStories: PropTypes.bool,
  setIsSortingStories: PropTypes.func,
  maxNumOfStories: PropTypes.number,
};

export default StoryPicker;
