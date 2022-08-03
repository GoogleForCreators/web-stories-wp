/*
 * Copyright 2022 Google LLC
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
import { generateMaskId } from '@googleforcreators/masks';
/**
 * Internal dependencies
 */
import useShapeMask from '../../../utils/useShapeMask';
import StoryPropTypes from '../../../types';

const MaskedIconWrapper = styled.div`
  position: relative;
  clip-path: url(#${({ maskId }) => maskId});
`;

function ShapeMaskWrapper({ element, children }) {
  const { hasShapeMask } = useShapeMask(element);

  if (!hasShapeMask) {
    return children;
  }

  return (
    <MaskedIconWrapper maskId={generateMaskId(element, 'frame')}>
      {children}
    </MaskedIconWrapper>
  );
}

export default ShapeMaskWrapper;
ShapeMaskWrapper.propTypes = {
  element: StoryPropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
};
