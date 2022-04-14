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
import { __ } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const SubMenuContainer = styled.div`
  position: absolute;
  top: ${({ position }) => position?.y ?? 0}px;
  left: ${({ position }) => position?.x ?? 0}px;
  z-index: 9999;
`;
SubMenuContainer.propTypes = {
  position: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }),
};

export const DEFAULT_DISPLACEMENT = 210;

export const SUB_MENU_ARIA_LABEL = __('Select a layer', 'web-stories');

export const MenuPropType = {
  parentMenuRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current:
        typeof Element !== 'undefined'
          ? PropTypes.instanceOf(Element)
          : PropTypes.any,
    }), // To handle in SSR.
  ]).isRequired,
};
