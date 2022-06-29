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
import StackableInput from './stackableInput';

/**
 * Internal dependencies
 */

const StackableContainer = styled.div`
  display: flex;
  max-width: ${({ locked }) => (locked ? '106px' : 'none')};

  & > ${StackableInput} {
    border-radius: 0;

    &:first-of-type > div {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      margin-left: 0;
    }

    &:last-of-type > div {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }

  ${({ $stackableGroupStyleOverride }) => $stackableGroupStyleOverride}
`;

function StackableGroup({
  children,
  locked,
  className,
  stackableGroupStyleOverride,
}) {
  return (
    <StackableContainer
      $stackableGroupStyleOverride={stackableGroupStyleOverride}
      locked={locked}
      className={className}
    >
      {children}
    </StackableContainer>
  );
}

StackableGroup.propTypes = {
  children: PropTypes.node,
  locked: PropTypes.bool,
  className: PropTypes.string,
  stackableGroupStyleOverride: PropTypes.array,
};

export default StackableGroup;
