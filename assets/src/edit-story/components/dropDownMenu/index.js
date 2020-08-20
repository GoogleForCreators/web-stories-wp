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

const MoreButton = styled(More)`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${({ theme }) => theme.colors.bg.panel};
  color: ${({ theme }) => theme.colors.fg.white};
  border-radius: 100%;
`;

const DropDownContainer = styled.div`
  margin-top: 10px;
`;

function DropDownMenu({ options, onOption }) {
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const handleOption = useCallback(
    (val) => {
      setIsOpen(false);
      onOption(val);
    },
    [onOption]
  );

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    <>
      <MoreButton
        ref={ref}
        width="28"
        height="28"
        onClick={() => setIsOpen(true)}
        aria-label={__('More', 'web-stories')}
        aria-pressed={isOpen}
        aria-haspopup={true}
        aria-expanded={isOpen}
      />
      <Popup placement="bottom-end" anchor={ref} isOpen={isOpen} width={160}>
        <DropDownContainer>
          <DropDownList
            handleCurrentValue={handleOption}
            options={options}
            value={options[0].value}
            toggleOptions={() => setIsOpen(false)}
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
