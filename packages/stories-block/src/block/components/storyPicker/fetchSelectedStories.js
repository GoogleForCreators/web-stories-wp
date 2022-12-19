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
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { store as coreStore } from '@wordpress/core-data';
import LoaderContainer from '../loaderContainer';

function FetchSelectedStories({
  icon,
  label,
  selectedStoryIds = [],
  setSelectedStories,
  setIsFetching,
}) {
  const { isFetchingStories = false, fetchedStories = [] } = useSelect(
    (select) => {
      const { getEntityRecords, isResolving } = select(coreStore);
      const newQuery = {
        _embed: 'author,wp:featuredmedia',
        context: 'edit',
        include: selectedStoryIds,
        orderby: selectedStoryIds.length > 0 ? 'include' : undefined,
      };

      return {
        fetchedStories: getEntityRecords('postType', 'web-story', newQuery),
        isFetchingStories: isResolving('postType', 'web-story', newQuery),
      };
    },
    [selectedStoryIds]
  );

  useEffect(() => {
    setIsFetching(isFetchingStories);
    setSelectedStories(fetchedStories);
  }, [fetchedStories, isFetchingStories, setIsFetching, setSelectedStories]);

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
