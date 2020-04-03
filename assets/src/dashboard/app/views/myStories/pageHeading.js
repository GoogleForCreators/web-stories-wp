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
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { storiesPropType } from '../../../propTypes';
import { ViewHeader } from '../../../components';
import MyStoriesSearch from './myStoriesSearch';

const Container = styled.div`
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

const PageHeading = ({
  defaultTitle,
  filteredStories = [],
  handleTypeaheadChange,
  typeaheadValue = '',
}) => {
  const resultsText =
    filteredStories.length > 0
      ? sprintf(__('Results for "%s"', 'web-stories'), typeaheadValue)
      : sprintf(__('No results for "%s"', 'web-stories'), typeaheadValue);

  const viewHeaderText = typeaheadValue.length ? resultsText : defaultTitle;

  return (
    <Container>
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
    </Container>
  );
};

PageHeading.propTypes = {
  defaultTitle: PropTypes.string.isRequired,
  filteredStories: storiesPropType,
  handleTypeaheadChange: PropTypes.func,
  typeaheadValue: PropTypes.string,
};

export default PageHeading;
