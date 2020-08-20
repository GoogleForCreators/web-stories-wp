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
import { useCallback, useRef, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { More } from '../button';
import DropDownList from '../form/dropDown/list';
import Popup from '../popup';
import { useKeyDownEffect } from '../keyboard';

const MoreButton = styled(More)`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  padding: 0;
  background: ${({ theme }) => theme.colors.bg.panel};
  color: ${({ theme }) => theme.colors.fg.white};
  border-radius: 100%;
  border: 0;
`;

const DropDownContainer = styled.div`
  margin-top: 10px;
`;

function DropDownMenu({ options, onOption }) {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const handleOption = useCallback(
    (...args) => {
      setIsOpen(false);
      onOption(...args);
    },
    [onOption]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    ref.current.focus();
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  useKeyDownEffect(ref, ['enter', 'down', 'up'], handleOpen, [handleOpen]);

  return (
    <>
      <MoreButton
        ref={ref}
        onClick={handleOpen}
        aria-pressed={isOpen}
        aria-haspopup={true}
        aria-expanded={isOpen}
        width="28"
        height="28"
        aria-label={__('More', 'web-stories')}
      />
      <Popup placement="bottom-end" anchor={ref} isOpen={isOpen} width={160}>
        <DropDownContainer>
          <DropDownList
            handleCurrentValue={handleOption}
            options={options}
            value={options[0].value}
            toggleOptions={handleClose}
          />
        </DropDownContainer>
      </Popup>
    </>
  );
}

DropDownMenu.propTypes = {
  options: PropTypes.array.isRequired,
  onOption: PropTypes.func.isRequired,
};

export default DropDownMenu;
