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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { __ } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { StoriesPropType } from '../../../types';
import { NavMenuButton, StandardViewContentGutter } from '../../../components';
import { Headline, Search, THEME_CONSTANTS } from '../../../../design-system';

const HeadingContainer = styled(StandardViewContentGutter)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-top: 48px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider.secondary};
`;

const StyledHeadline = styled(Headline)`
  display: flex;
  align-items: center;
  margin-right: 8px;
  white-space: nowrap;
`;

const HeadlineFilters = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
`;

const HeaderSearch = styled.div`
  width: 208px;
  max-width: 208px;
  margin: auto 0;
`;

const PageHeading = ({
  children,
  defaultTitle,
  searchPlaceholder,
  searchOptions = [],
  showTypeahead = true,
  handleTypeaheadChange,
  searchValue = {},
}) => {
  return (
    <HeadingContainer>
      <StyledHeadline
        as="h2"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_LARGE}
      >
        <NavMenuButton showOnlyOnSmallViewport />
        {defaultTitle}
      </StyledHeadline>
      <HeadlineFilters>{children}</HeadlineFilters>
      {showTypeahead && (
        <HeaderSearch>
          <Search
            placeholder={searchPlaceholder}
            selectedValue={searchValue}
            options={searchOptions}
            onMenuItemClick={() => {}}
            handleSearchValueChange={handleTypeaheadChange}
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
  defaultTitle: PropTypes.string.isRequired,
  searchPlaceholder: PropTypes.string,
  searchOptions: StoriesPropType,
  showTypeahead: PropTypes.bool,
  handleTypeaheadChange: PropTypes.func,
  searchValue: PropTypes.string,
};

export default PageHeading;
