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
import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { TranslateWithMarkup, __ } from '@web-stories-wp/i18n';
import { trackClick } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import {
  Text,
  THEME_CONSTANTS,
  DropDown,
  themeHelpers,
  Link,
} from '../../../../design-system';
import { StandardViewContentGutter, ViewStyleBar } from '../../../components';
import { DROPDOWN_TYPES, VIEW_STYLE } from '../../../constants';
import TelemetryBanner from './telemetryBanner';

const DisplayFormatContainer = styled.div`
  height: ${({ theme }) => theme.DEPRECATED_THEME.formatContainer.height}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -10px;
`;

const StorySortDropdownContainer = styled.div`
  margin: auto 8px;
  align-self: flex-end;
`;

const ControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledLink = styled(Link)`
  font-weight: 700;
  margin-right: 24px;
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
  const handleClassicListViewClick = useCallback((evt) => {
    trackClick(evt, 'open_classic_list_view');
  }, []);

  return (
    <StandardViewContentGutter>
      <TelemetryBanner />
      <DisplayFormatContainer>
        <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          <TranslateWithMarkup>{resultsLabel}</TranslateWithMarkup>
        </Text>
        <ControlsContainer>
          {layoutStyle === VIEW_STYLE.GRID && showSortDropdown && (
            <StorySortDropdownContainer>
              <DropDown
                ariaLabel={sortDropdownAriaLabel}
                options={pageSortOptions}
                type={DROPDOWN_TYPES.MENU}
                selectedValue={currentSort}
                onMenuItemClick={(_, newSort) => handleSortChange(newSort)}
                selectButtonStyles={css`
                  ${themeHelpers.expandTextPreset(
                    ({ paragraph }, sizes) => paragraph[sizes.SMALL]
                  )}
                  border: none;
                  text-align: right;
                  justify-content: flex-end;

                  &,
                  & > span {
                    color: ${({ theme }) => theme.colors.fg.secondary};
                  }
                `}
                popupStyles={css`
                  width: 210px;
                `}
              />
            </StorySortDropdownContainer>
          )}
          {showGridToggle && (
            <ControlsContainer>
              {layoutStyle === VIEW_STYLE.LIST && wpListURL && (
                <StyledLink
                  href={wpListURL}
                  onClick={handleClassicListViewClick}
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                >
                  {__('See classic WP list view', 'web-stories')}
                </StyledLink>
              )}
              <ViewStyleBar
                layoutStyle={layoutStyle}
                onPress={handleLayoutSelect}
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
