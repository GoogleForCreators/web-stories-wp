/*
 * Copyright 2021 Google LLC
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
import { Tooltip, TOOLTIP_PLACEMENT } from '../../tooltip';

const TooltipWrapper = styled.div`
  margin: 0 auto;
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
`;

function Icon({
  children,
  placement = TOOLTIP_PLACEMENT.RIGHT,
  title,
  ...props
}) {
  return (
    <TooltipWrapper>
      <Tooltip placement={placement} title={title} {...props}>
        <IconWrapper>{children}</IconWrapper>
      </Tooltip>
    </TooltipWrapper>
  );
}
Icon.propTypes = {
  children: PropTypes.node,
  placement: PropTypes.oneOf(Object.values(TOOLTIP_PLACEMENT)),
  title: PropTypes.string.isRequired,
};

export default Icon;
