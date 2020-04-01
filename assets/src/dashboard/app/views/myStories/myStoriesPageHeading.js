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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { ViewHeader } from '../../../components';
import MyStoriesSearch from './myStoriesSearch';

const PageHeading = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 40px 20px;
`;

const ViewHeaderContainer = styled.div`
  width: 60%;
  margin: auto 0;
`;

const SearchContainer = styled.div`
  position: absolute;
  max-width: 35%;
  margin: auto 0;
  right: 20px;
  display: flex;
  justify-content: flex-end;
`;

const MyStoriesPageHeading = ({
  typeaheadValue = '',
  handleTypeaheadChange,
  filteredStories = [],
}) => {
  const viewHeaderText =
    typeaheadValue.length > 0 ? (
      <>
        {__('Results for', 'web-stories')} {typeaheadValue}
      </>
    ) : (
      __('My Stories', 'web-stories')
    );

  return (
    <PageHeading>
      <ViewHeaderContainer>
        <ViewHeader>{viewHeaderText}</ViewHeader>
      </ViewHeaderContainer>
      <SearchContainer>
        <MyStoriesSearch
          currentValue={typeaheadValue}
          filteredStories={filteredStories}
          handleChange={handleTypeaheadChange}
        />
      </SearchContainer>
    </PageHeading>
  );
};

MyStoriesPageHeading.propTypes = {
  typeaheadValue: PropTypes.string,
  handleTypeaheadChange: PropTypes.func,
  filteredStories: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    })
  ),
};

export default MyStoriesPageHeading;
