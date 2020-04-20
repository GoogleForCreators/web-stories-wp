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
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import { useContext } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import PropTypes from 'prop-types';
import { ReactComponent as Edit } from '../../../icons/edit_pencil.svg';
import { ReactComponent as Add } from '../../../icons/add_page.svg';
import { ReactComponent as Arrow } from '../../../icons/arrow.svg';
import panelContext from '../panel/context';

const Header = styled.h2`
  border: 0 solid ${({ theme }) => theme.colors.bg.v9};
  color: ${({ theme }) => theme.colors.fg.v1};
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  user-select: none;
`;

const HeaderButton = styled.div.attrs({ role: 'button' })`
  color: inherit;
  border: 0;
  padding: 10px 20px;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Heading = styled.span`
  color: inherit;
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

const buttonCSS = css`
  background: transparent;
  width: 30px;
  height: 28px;
  border: none;
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.84)};
  cursor: pointer;
  padding: 0;
`;

const AddColorPresetButton = styled.button`
  ${buttonCSS}
  svg {
    width: 26px;
    height: 28px;
  }
`;

const Collapse = styled.button`
  ${buttonCSS}
  svg {
    width: 28px;
    height: 28px;
    ${({ isCollapsed }) => isCollapsed && `transform: rotate(.5turn);`}
  }
`;

const ExitEditMode = styled.button`
  ${buttonCSS}
  color: ${({ theme }) => theme.colors.fg.v1};
  font-size: 12px;
  line-height: 14px;
  padding: 7px;
  height: initial;
`;

const EditModeButton = styled.button`
  ${buttonCSS}
  height: 20px;
  svg {
    width: 16px;
    height: 20px;
  }
`;

function PresetsHeader({
  handleAddColorPreset,
  isEditMode,
  setIsEditMode,
  stylePresets,
}) {
  const {
    state: { isCollapsed, panelContentId },
    actions: { collapse, expand },
  } = useContext(panelContext);

  const { fillColors, textColors, textStyles } = stylePresets;
  const hasPresets =
    fillColors.length > 0 || textColors.length > 0 || textStyles.length > 0;
  const getActions = () => {
    return !isEditMode ? (
      <>
        {hasPresets && (
          <EditModeButton
            onClick={(evt) => {
              evt.stopPropagation();
              setIsEditMode(true);
            }}
            aria-label={__('Edit presets', 'web-stories')}
          >
            <Edit />
          </EditModeButton>
        )}
        <AddColorPresetButton
          onClick={handleAddColorPreset}
          aria-label={__('Add preset', 'web-stories')}
        >
          <Add />
        </AddColorPresetButton>
        {hasPresets && (
          <Collapse isCollapsed={isCollapsed}>
            <Arrow />
          </Collapse>
        )}
      </>
    ) : (
      <ExitEditMode
        onClick={(evt) => {
          evt.stopPropagation();
          setIsEditMode(false);
        }}
        aria-label={__('Exit edit mode', 'web-stories')}
      >
        {__('Exit', 'web-stories')}
      </ExitEditMode>
    );
  };

  const titleLabel = isCollapsed
    ? __('Expand panel', 'web-stories')
    : __('Collapse panel', 'web-stories');
  return (
    <Header>
      <HeaderButton
        onClick={isCollapsed ? expand : collapse}
        aria-label={titleLabel}
        aria-expanded={!isCollapsed}
        aria-controls={panelContentId}
      >
        <Heading>{__('Presets', 'web-stories')}</Heading>
        <HeaderActions>{getActions()}</HeaderActions>
      </HeaderButton>
    </Header>
  );
}

PresetsHeader.propTypes = {
  stylePresets: PropTypes.shape({
    fillColors: PropTypes.array,
    textColors: PropTypes.array,
    textStyles: PropTypes.array,
  }).isRequired,
  isEditMode: PropTypes.bool.isRequired,
  handleAddColorPreset: PropTypes.func.isRequired,
  setIsEditMode: PropTypes.func.isRequired,
};

export default PresetsHeader;
