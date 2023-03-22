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
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import LoaderContainer from '../loaderContainer';

function FetchSelectedStories({
  icon,
  label,
  selectedStoryIds = [],
  setSelectedStories,
  setIsFetching,
}) {
  const data = useSelect((select) => {
    return select(coreStore).getEntityRecords('postType', 'web-story', {
      _embed: 'wp:featuredmedia,author',
      context: 'view',
      include: selectedStoryIds,
      orderby: selectedStoryIds.length > 0 ? 'include' : undefined,
    });
  });

  useEffect(() => {
    // data is null before a response
    // has some value after the request
    // is undefined if the entities requested does not exist
    if (data !== null && data !== undefined) {
      //Entities found
      setSelectedStories(data);
      setIsFetching(false);
    }
    if (data === undefined) {
      //could not find entities
      setSelectedStories([]);
      setIsFetching(false);
    }
  }, [data, setSelectedStories, setIsFetching]);

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
