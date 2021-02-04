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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Z_INDEX } from '../../constants';
import { PILL_LABEL_TYPES } from '../../constants/components';
import { Close as CloseIcon } from '../../icons';
import { visuallyHiddenStyles } from '../../utils/visuallyHiddenStyles';
import { DROPDOWN_ITEM_PROP_TYPE } from '../types';
import Pill from '../pill';

export const Panel = styled.div(
  ({ isNarrow, isOpen, theme }) => `
    align-items: flex-start;
    background-color: ${theme.DEPRECATED_THEME.colors.white};
    border-radius: 8px;
    box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    opacity: ${isOpen ? 1 : 0};
    overflow: hidden;
    padding: 10px 20px;
    margin: 10px 0 0;
    position: absolute;
    pointer-events: ${isOpen ? 'auto' : 'none'};
    transform: ${isOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, -1rem, 0)'};
    z-index: ${Z_INDEX.POPOVER_PANEL};

    ${
      isNarrow
        ? `width: 260px;`
        : `
          width: ${theme.DEPRECATED_THEME.popoverPanel.desktopWidth}px;

          @media ${theme.DEPRECATED_THEME.breakpoint.tablet} {
            width: ${theme.DEPRECATED_THEME.popoverPanel.tabletWidth}px;
          }

           @media ${theme.DEPRECATED_THEME.breakpoint.desktop} {
            width: ${theme.DEPRECATED_THEME.popoverPanel.desktopWidth}px;
          }
    `
    }
  `
);

Panel.propTypes = {
  isNarrow: PropTypes.bool,
  isOpen: PropTypes.bool,
};

const PillFieldset = styled.fieldset`
  width: 100%;
  margin: 20px 0 0 0;
  padding: 0;
  border: none;
  > label {
    margin: 0 10px 14px 0;
  }
`;

const Legend = styled.legend`
  ${visuallyHiddenStyles}
`;

const KeyboardCloseOnly = styled.button`
  ${visuallyHiddenStyles}
  &:focus {
    clip: unset;
    align-self: flex-end;
    border: ${({ theme }) => theme.DEPRECATED_THEME.borders.action};
    border-radius: 50%;
    height: 20px;
    width: 20px;
    padding: 2px;
    > svg {
      padding: 2px;
    }
  }
`;

const PopoverPanel = ({
  onClose,
  isOpen,
  title,
  items,
  labelType = PILL_LABEL_TYPES.DEFAULT,
  onSelect,
}) => {
  return (
    <Panel isOpen={isOpen} isNarrow={labelType === PILL_LABEL_TYPES.SWATCH}>
      {isOpen && (
        <>
          <KeyboardCloseOnly
            onClick={onClose}
            data-testid={'popover-close-btn'}
            aria-label={__('close menu', 'web-stories')}
          >
            <CloseIcon width={14} height="14" />
          </KeyboardCloseOnly>
          <PillFieldset data-testid={'pill-fieldset'}>
            <Legend title={`options for ${title}`} />
            {items.map(({ label, selected, value, hex, disabled = false }) => {
              return (
                <Pill
                  data-testid={'popover-pill'}
                  key={value}
                  inputType="checkbox"
                  label={label}
                  name={`${title}_pillGroup_${value}`}
                  onClick={onSelect}
                  value={value}
                  isSelected={selected}
                  disabled={disabled}
                  hex={hex}
                  labelType={labelType}
                >
                  {label}
                </Pill>
              );
            })}
          </PillFieldset>
        </>
      )}
    </Panel>
  );
};

PopoverPanel.propTypes = {
  title: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  labelType: PropTypes.oneOf(Object.values(PILL_LABEL_TYPES)),
  items: PropTypes.arrayOf(DROPDOWN_ITEM_PROP_TYPE),
};

export default PopoverPanel;
