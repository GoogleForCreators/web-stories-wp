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
import {
  Button,
  ButtonType,
  themeHelpers,
} from '@googleforcreators/design-system';
import { useRef, memo, useContext } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import usePerformanceTracking from '../../../utils/usePerformanceTracking';
import Tooltip from '../../tooltip';
import LayerIdContext from './layerIdContext';

const ActionButton = styled(Button).attrs({
  type: ButtonType.Plain,
  tabIndex: -1,
})`
  position: relative;
  aspect-ratio: 1;
  width: 20px;
  padding: 0;

  /*
   * all of our Icons right now have an embedded padding,
   * however the new designs just disregard this embedded
   * padding, so to accommodate, we'll make the icon its
   * intended size and manually center it within the button.
   */
  svg {
    position: absolute;
    width: 32px;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  /*
   * override base button background color so we can receive the
   * proper background color from the parent.
   */
  && {
    transition: revert;
    background: var(--background-color);
  }

  :disabled {
    color: ${({ theme }) => theme.colors.fg.secondary};
  }

  :hover {
    color: var(
      --selected-hover-color,
      ${({ theme }) => theme.colors.fg.secondary}
    );
  }

  & + & {
    margin-left: 4px;
  }

  * {
    pointer-events: none;
  }

  :focus {
    ${({ theme }) =>
      themeHelpers.focusCSS(
        theme.colors.border.focus,
        'var(--background-color)'
      )}
  }
`;

function preventReorder(e) {
  e.stopPropagation();
  e.preventDefault();
}

function LayerAction({
  label,
  handleClick,
  children,
  disabled = false,
  isActive = true,
  trackingData = null,
}) {
  const buttonRef = useRef(null);
  usePerformanceTracking({
    // eslint-disable-next-line react-hooks/refs -- FIXME
    node: trackingData ? buttonRef.current : null,
    eventData: trackingData,
  });

  const layerId = useContext(LayerIdContext);

  if (!isActive) {
    return null;
  }

  return (
    <Tooltip title={label} hasTail isDelayed>
      <ActionButton
        aria-label={label}
        aria-describedby={layerId}
        onPointerDown={preventReorder}
        disabled={disabled}
        onClick={handleClick}
        ref={buttonRef}
      >
        {children}
      </ActionButton>
    </Tooltip>
  );
}

LayerAction.propTypes = {
  label: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  isActive: PropTypes.bool,
  trackingData: PropTypes.object,
};

export default memo(LayerAction);
