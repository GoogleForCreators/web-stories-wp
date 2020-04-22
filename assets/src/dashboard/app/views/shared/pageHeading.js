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
import { StoriesPropType } from '../../../types';
import { ViewHeader } from '../../../components';
import TypeaheadSearch from './typeaheadSearch';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: ${({ theme }) => `20px ${theme.pageGutter.small.desktop}px 40px`};
  max-width: 100%;

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    display: block;
    margin: ${({ theme }) => `20px ${theme.pageGutter.small.min}px 60px`};
  }
`;

const ViewHeaderContainer = styled.div`
  width: 60%;
  margin: auto 0;
  overflow-wrap: break-word;
  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    width: 100%;
    padding-bottom: 5px;
  }
`;

const SearchContainer = styled.div`
  position: absolute;
  max-width: 35%;
  margin: auto 0;
  right: ${({ theme }) => `${theme.pageGutter.small.desktop}px`};
  display: flex;
  justify-content: flex-end;
  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    left: ${({ theme }) => `${theme.pageGutter.small.min}px`};
    max-width: 100%;
    justify-content: flex-start;
  }
`;

const PageHeading = ({
  defaultTitle,
  searchPlaceholder,
  filteredStories = [],
  handleTypeaheadChange,
  typeaheadValue = '',
}) => {
  const resultsText =
    filteredStories.length > 0
      ? sprintf(
          /* translators: %s: search term. */
          __('Results for "%s"', 'web-stories'),
          typeaheadValue
        )
      : sprintf(
          /* translators: %s: search term. */
          __('No results for "%s"', 'web-stories'),
          typeaheadValue
        );

  const viewHeaderText = typeaheadValue.length ? resultsText : defaultTitle;

  return (
    <Container>
      <ViewHeaderContainer>
        <ViewHeader>{viewHeaderText}</ViewHeader>
      </ViewHeaderContainer>
      <SearchContainer>
        <TypeaheadSearch
          placeholder={searchPlaceholder}
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
  searchPlaceholder: PropTypes.string,
  filteredStories: StoriesPropType,
  handleTypeaheadChange: PropTypes.func,
  typeaheadValue: PropTypes.string,
};

export default PageHeading;
