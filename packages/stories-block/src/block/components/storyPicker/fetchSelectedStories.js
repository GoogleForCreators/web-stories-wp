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
import { Placeholder } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal dependencies
 */
import LoaderContainer from '../loaderContainer';

const {
  config: {
    api: { stories: storiesApi },
  },
} = window.webStoriesBlockSettings;

function FetchSelectedStories({
  icon,
  label,
  selectedStoryIds = [],
  setSelectedStories,
  setIsFetching,
}) {
  const { createErrorNotice } = useDispatch(noticesStore);

  const fetchStories = async () => {
    try {
      const response = await apiFetch({
        path: addQueryArgs(storiesApi, {
          _embed: 'author,wp:featuredmedia',
          context: 'edit',
          include: selectedStoryIds,
          orderby: selectedStoryIds.length > 0 ? 'include' : undefined,
        }),
      });

      if (response.length) {
        setSelectedStories(response);
      }
    } catch (error) {
      createErrorNotice(
        sprintf(
          /* translators: %s: error message. */
          __('Unable to load stories. %s', 'web-stories'),
          error?.message || ''
        ),
        {
          type: 'snackbar',
        }
      );
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run this once.
  }, []);

  return (
    <Placeholder
      icon={<BlockIcon icon={icon} showColors />}
      label={label}
      className="wp-block-web-stories-embed"
      instructions={false}
    >
      <LoaderContainer>{__('Loading Stories…', 'web-stories')}</LoaderContainer>
    </Placeholder>
  );
}

FetchSelectedStories.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  selectedStoryIds: PropTypes.array,
  setSelectedStories: PropTypes.func,
  setIsFetching: PropTypes.func,
};

export default FetchSelectedStories;
