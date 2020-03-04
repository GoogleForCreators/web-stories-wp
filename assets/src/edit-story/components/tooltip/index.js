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
import MUITooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { prettifytShortcut } from '../keyboard';

const StyledTooltip = styled((props) => (
  <MUITooltip
    classes={{
      popper: props.className,
      tooltip: 'tooltip',
      arrow: 'arrow',
    }}
    {...props}
  />
))`
  & .tooltip {
    background-color: ${({ theme }) => theme.colors.bg.v4};
  }
  & .arrow {
    color: ${({ theme }) => theme.colors.bg.v4};
  }
`;

const Tooltip = ({ title, shortcut, arrow = true, ...props }) => {
  return (
    <StyledTooltip
      title={shortcut ? `${title} (${prettifytShortcut(shortcut)})` : title}
      arrow={arrow}
      {...props}
    />
  );
};

Tooltip.propTypes = {
  title: PropTypes.string,
  shortcut: PropTypes.string,
  arrow: PropTypes.bool,
};

export default Tooltip;
