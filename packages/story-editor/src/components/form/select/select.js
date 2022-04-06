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
import { DropDown } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { focusStyle } from '../../panels/shared/styles';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const StyledDropDown = styled(DropDown)`
  background-color: transparent;
  border: 0;
  width: auto;
`;

const menuStylesOverride = css`
  top: -14px;
  right: unset;
  width: auto;
`;

const selectButtonStylesOverride = css`
  border: none;
  width: auto;
  margin-right: auto;
  padding-left: 0;

  ${focusStyle};
`;

const selectValueStylesOverride = css`
  margin-right: -12px;
`;

function Select(props) {
  return (
    <Container>
      <StyledDropDown
        isInline
        hasSearch={false}
        menuStylesOverride={menuStylesOverride}
        selectButtonStylesOverride={selectButtonStylesOverride}
        selectValueStylesOverride={selectValueStylesOverride}
        {...props}
      />
    </Container>
  );
}

export default Select;
