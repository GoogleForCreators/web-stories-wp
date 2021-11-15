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
import { useCallback } from '@web-stories-wp/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { __ } from '@web-stories-wp/i18n';
import {
  Display,
  Search,
  THEME_CONSTANTS,
  noop,
} from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { NavMenuButton, StandardViewContentGutter } from '../../../components';

const HeadingContainer = styled(StandardViewContentGutter)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-top: 48px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider.secondary};
`;

const StyledHeadline = styled(Display)`
  display: flex;
  align-items: center;
  margin-right: 28px;
  padding-bottom: 24px;
  white-space: nowrap;
`;

const HeadlineFilters = styled.div`
  display: flex;
  align-items: center;
  margin: auto 0 auto 0;
  padding-bottom: 24px;
`;

const HeaderSearch = styled.div`
  width: 208px;
  max-width: 208px;
  min-width: 208px;
  margin: auto 0;
  padding-bottom: 24px;
`;

const PageHeading = ({
  children,
  heading,
  searchPlaceholder,
  searchOptions = [],
  showSearch,
  handleSearchChange,
  searchValue = '',
  clearSearch = noop,
}) => {
  const handleClearSearch = useCallback(
    (evt) => {
      // evt is null when user presses the clear button
      if (evt === null) {
        clearSearch();
      }
    },
    [clearSearch]
  );

  return (
    <HeadingContainer>
      <StyledHeadline
        as="h2"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
      >
        <NavMenuButton showOnlyOnSmallViewport />
        {heading}
      </StyledHeadline>
      {children && <HeadlineFilters>{children}</HeadlineFilters>}
      {showSearch && (
        <HeaderSearch>
          <Search
            placeholder={searchPlaceholder}
            selectedValue={{ label: searchValue, value: searchValue }}
            options={searchOptions}
            handleSearchValueChange={handleSearchChange}
            onMenuItemClick={handleClearSearch}
            emptyText={__('No options available', 'web-stories')}
          />
        </HeaderSearch>
      )}
    </HeadingContainer>
  );
};

PageHeading.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  heading: PropTypes.string.isRequired,
  searchPlaceholder: PropTypes.string,
  searchOptions: PropTypes.arrayOf(PropTypes.object),
  showSearch: PropTypes.bool,
  handleSearchChange: PropTypes.func,
  clearSearch: PropTypes.func,
  searchValue: PropTypes.string,
};

export default PageHeading;
