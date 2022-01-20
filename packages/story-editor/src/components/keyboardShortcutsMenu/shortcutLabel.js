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
import { themeHelpers } from '@googleforcreators/design-system';

const Wrapper = styled.dd`
  display: block;
  margin: 0;

  kbd {
    ${themeHelpers.expandTextPreset(
      ({ paragraph }, { X_SMALL }) => paragraph[X_SMALL]
    )}

    display: flex;
    justify-content: ${({ alignment }) => alignment};
    align-items: center;
    margin: 0;
    padding: 0;
    color: ${({ theme }) => theme.colors.fg.secondary};
    background-color: transparent;

    & > kbd {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 5px;
      height: 24px;
      width: 24px;
      border-radius: ${({ theme }) => theme.borders.radius.medium};
      border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
      color: ${({ theme }) => theme.colors.fg.primary};
    }

    & > kbd.large-key {
      width: auto;
    }

    kbd + kbd {
      margin-left: 2px;
    }

    kbd + span {
      margin-left: 4px;
    }

    span + kbd {
      margin-left: 4px;
    }
  }
`;

function ShortCutLabel({ keys, alignment = 'center', ...rest }) {
  return (
    <Wrapper alignment={alignment} {...rest}>
      {keys}
    </Wrapper>
  );
}

ShortCutLabel.propTypes = {
  keys: PropTypes.PropTypes.element,
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
};

export default ShortCutLabel;
