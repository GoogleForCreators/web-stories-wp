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
import { memo } from '@googleforcreators/react';
import styled from 'styled-components';
import { ContextMenuComponents } from '@googleforcreators/design-system';

const Button = styled(ContextMenuComponents.MenuButton)`
  font-size: 14px;
  padding: 0 12px;
  font-weight: normal;
  letter-spacing: normal;
`;

const TextButton = memo(function TextButton({ text, ...rest }) {
  return (
    <Button forcePadding {...rest}>
      {text}
    </Button>
  );
});

TextButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TextButton;
