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
import { StoriesPropType } from '../../../types';
import { ViewHeader } from '../../../components';
import BodyWrapper from './bodyWrapper';
import TypeaheadSearch from './typeaheadSearch';

const lerp = (start, end, progress) => {
  return `calc(calc(calc(1 - var(${progress}, 0)) * ${start}) + calc(var(${progress}, 0) * ${end}))`;
};

const Container = styled.div`
  padding: 10px 0;
`;

const StyledHeader = styled(ViewHeader)`
  display: inline-block;
  width: 25%;
  justify-content: baseline;
  line-height: 1;
  font-size: ${lerp('38px', '24px', '--progress')};
`;

const Content = styled.div`
  display: inline-block;
  justify-content: baseline;
  width: 50%;
`;

const SearchContainer = styled.div`
  display: inline-block;
  vertical-align: baseline;
  position: relative;
  width: 25%;
  overflow: hidden; 
  /* needed to break display flow and align bottom to text */
  /* margin: auto 0; */
  /* right: ${({ theme }) => `${theme.pageGutter.small.desktop}px`}; */
  /* display: flex;
  justify-content: flex-end; */
  /* @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    left: ${({ theme }) => `${theme.pageGutter.small.min}px`};
    max-width: 100%;
    justify-content: flex-start;
  } */
`;

const SearchInner = styled.div`
  position: relative;
  width: min(190px, 100%);
  margin-left: auto;
`;

const PageHeading = ({
  children,
  defaultTitle,
  searchPlaceholder,
  filteredStories = [],
  handleTypeaheadChange,
  typeaheadValue = '',
}) => {
  // const resultsText =
  //   filteredStories.length > 0
  //     ? sprintf(
  //         /* translators: %s: search term. */
  //         __('Results for "%s"', 'web-stories'),
  //         typeaheadValue
  //       )
  //     : sprintf(
  //         /* translators: %s: search term. */
  //         __('No results for "%s"', 'web-stories'),
  //         typeaheadValue
  //       );

  return (
    <Container>
      <BodyWrapper>
        <StyledHeader>{defaultTitle}</StyledHeader>
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
      </BodyWrapper>
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
