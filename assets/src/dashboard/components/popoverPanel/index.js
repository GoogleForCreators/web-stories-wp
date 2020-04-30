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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { ReactComponent as CloseIcon } from '../../icons/close.svg';
import { Z_INDEX } from '../../constants';
import { Pill } from '../pill';
import { DROPDOWN_ITEM_PROP_TYPE } from '../types';
import { ColorDot } from '../colorDot';

export const Panel = styled.div`
  align-items: flex-start;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  overflow: hidden;
  padding: 20px 20px 8px;
  margin: 24px 0 0;
  position: absolute;
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  transform: ${({ isOpen }) =>
    isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, -1rem, 0)'};
  z-index: ${Z_INDEX.POPOVER_PANEL};
  width: ${({ theme }) => theme.popoverPanel.desktopWidth}px;

  @media ${({ theme }) => theme.breakpoint.tablet} {
    width: ${({ theme }) => theme.popoverPanel.tabletWidth}px;
  }

  @media ${({ theme }) => theme.breakpoint.desktop} {
    width: ${({ theme }) => theme.popoverPanel.desktopWidth}px;
  }
`;

Panel.propTypes = {
  isOpen: PropTypes.bool,
};

const CloseButton = styled.button`
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray400};
  margin: 0;
  padding: 0;
`;

const TitleBar = styled.div`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  display: flex;
`;

const PanelHeader = styled.h3`
  color: ${({ theme }) => theme.colors.gray700};
  font-family: ${({ theme }) => theme.fonts.heading3.family};
  font-size: ${({ theme }) => theme.fonts.heading3.size}px;
  font-weight: ${({ theme }) => theme.fonts.heading3.weight};
  line-height: ${({ theme }) => theme.fonts.heading3.lineHeight}px;
  letter-spacing: ${({ theme }) => theme.fonts.heading3.letterSpacing}em;
  margin: 0;
  padding-left: 20px;
`;

const PillFieldset = styled.fieldset`
  width: 100%;
  margin: 20px 0 0 0;
  padding: 0;
  border: none;
  > label {
    margin: 0 10px 14px 0;
  }
`;

const PopoverPanel = ({ isOpen, onClose, title, items, onSelect }) => {
  return (
    <Panel isOpen={isOpen}>
      <TitleBar>
        <CloseButton
          data-testid="popover-close-btn"
          aria-label="Close Button"
          onClick={onClose}
        >
          <CloseIcon width={13} height={13} />
        </CloseButton>
        <PanelHeader>{title}</PanelHeader>
      </TitleBar>
      {isOpen && (
        <PillFieldset data-testid={'pill-fieldset'}>
          {items.map(
            ({ label, selected, value, hex, disabled = false }, index) => {
              return (
                <Pill
                  key={`${value}_${index}`}
                  inputType="checkbox"
                  name={`${title}_pillGroup_${value}`}
                  onClick={onSelect}
                  value={value}
                  isSelected={selected}
                  disabled={disabled}
                >
                  {hex ? <ColorDot color={hex} /> : label}
                </Pill>
              );
            }
          )}
        </PillFieldset>
      )}
    </Panel>
  );
};

PopoverPanel.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  items: PropTypes.arrayOf(DROPDOWN_ITEM_PROP_TYPE),
};

export default PopoverPanel;
