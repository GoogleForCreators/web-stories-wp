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

/**
 * Internal dependencies
 */
import cssLerp from '../../../utils/cssLerp';
import { StoriesPropType } from '../../../types';
import { ViewHeader, NavMenuButton } from '../../../components';
import { DropdownContainer } from '../../../components/dropdown';
import BodyWrapper from './bodyWrapper';
import TypeaheadSearch from './typeaheadSearch';

const Container = styled.div`
  padding: 10px 0 0;
`;

const StyledHeader = styled(ViewHeader)`
  display: inline-flex;
  width: 25%;
  justify-content: flex-start;
  align-items: center;
  line-height: 1;
  font-size: ${cssLerp('30px', '18px', '--squish-progress')};
  white-space: nowrap;

  @media ${({ theme }) => theme.breakpoint.tablet} {
    font-size: ${cssLerp('20px', '14px', '--squish-progress')};
  }
`;

const Content = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50%;

  ${DropdownContainer} {
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
`;

const SearchContainer = styled.div`
  display: inline-block;
  vertical-align: baseline;
  position: relative;
  width: 25%;
  height: 29px;
  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    left: ${({ theme }) => `${theme.pageGutter.small.min}px`};
    max-width: 100%;
    justify-content: flex-start;
  }
`;

const SearchInner = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: min(190px, 100%);
`;

const HeadingBodyWrapper = styled(BodyWrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10px;
  border-bottom: ${({ theme }) => theme.subNavigationBar.border};
`;

const PageHeading = ({
  children,
  defaultTitle,
  searchPlaceholder,
  filteredStories = [],
  handleTypeaheadChange,
  typeaheadValue = '',
}) => {
  return (
    <Container>
      <HeadingBodyWrapper>
        <StyledHeader>
          <NavMenuButton showOnlyOnSmallViewport />
          {defaultTitle}
        </StyledHeader>
        <Content>{children}</Content>
        <SearchContainer>
          <SearchInner>
            <TypeaheadSearch
              placeholder={searchPlaceholder}
              currentValue={typeaheadValue}
              filteredStories={filteredStories}
              handleChange={handleTypeaheadChange}
            />
          </SearchInner>
        </SearchContainer>
      </HeadingBodyWrapper>
    </Container>
  );
};

PageHeading.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  defaultTitle: PropTypes.string.isRequired,
  searchPlaceholder: PropTypes.string,
  filteredStories: StoriesPropType,
  handleTypeaheadChange: PropTypes.func,
  typeaheadValue: PropTypes.string,
};

export default PageHeading;
