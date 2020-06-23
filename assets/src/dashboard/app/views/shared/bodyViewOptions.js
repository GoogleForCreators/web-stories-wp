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
import {
  Dropdown,
  StandardViewContentGutter,
  ViewStyleBar,
  TypographyPresets,
} from '../../../components';
import { DROPDOWN_TYPES, VIEW_STYLE } from '../../../constants';

const DisplayFormatContainer = styled.div`
  height: ${({ theme }) => theme.formatContainer.height}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StorySortDropdownContainer = styled.div`
  margin: auto 8px;
  align-self: flex-end;
`;

const SortDropdown = styled(Dropdown)`
  min-width: 210px;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.span`
  ${TypographyPresets.Small};
  color: ${({ theme }) => theme.colors.gray500};
`;

const ExternalLink = styled.a`
  ${TypographyPresets.Small};
  margin-right: 15px;
  color: ${({ theme }) => theme.colors.bluePrimary};
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
`;

export default function BodyViewOptions({
  currentSort,
  handleLayoutSelect,
  handleSortChange,
  resultsLabel,
  layoutStyle,
  pageSortOptions = [],
  showGridToggle,
  showSortDropdown,
  sortDropdownAriaLabel,
  wpListURL,
}) {
  return (
    <StandardViewContentGutter>
      <DisplayFormatContainer>
        <Label>{resultsLabel}</Label>
        <ControlsContainer>
          {layoutStyle === VIEW_STYLE.GRID && showSortDropdown && (
            <StorySortDropdownContainer>
              <SortDropdown
                alignment="flex-end"
                ariaLabel={sortDropdownAriaLabel}
                items={pageSortOptions}
                type={DROPDOWN_TYPES.MENU}
                value={currentSort}
                onChange={(newSort) => handleSortChange(newSort.value)}
              />
            </StorySortDropdownContainer>
          )}
          {showGridToggle && (
            <ControlsContainer>
              {layoutStyle === VIEW_STYLE.LIST && wpListURL && (
                <ExternalLink href={wpListURL}>
                  {__('See classic WP list view', 'web-stories')}
                </ExternalLink>
              )}
              <ViewStyleBar
                layoutStyle={layoutStyle}
                onPress={handleLayoutSelect}
                ariaLabel={__(
                  'Toggle between showing stories as a grid or list.',
                  'web-stories'
                )}
              />
            </ControlsContainer>
          )}
        </ControlsContainer>
      </DisplayFormatContainer>
    </StandardViewContentGutter>
  );
}

BodyViewOptions.propTypes = {
  currentSort: PropTypes.string.isRequired,
  handleLayoutSelect: PropTypes.func,
  handleSortChange: PropTypes.func,
  layoutStyle: PropTypes.string.isRequired,
  resultsLabel: PropTypes.string.isRequired,
  wpListURL: PropTypes.string,
  pageSortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  showGridToggle: PropTypes.bool,
  showSortDropdown: PropTypes.bool,
  sortDropdownAriaLabel: PropTypes.string.isRequired,
};
