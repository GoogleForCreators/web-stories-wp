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
import { noop } from '../../utils';
import { POPOVER_Z_INDEX } from './styled';

const ScreenMask = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  /* allow pointer events to pass through if there's no 'onDismiss' */
  pointer-events: ${({ hasOnDismiss }) => (hasOnDismiss ? 'auto' : 'none')};
  z-index: ${POPOVER_Z_INDEX - 1};
`;

export default function Mask({ onDismiss }) {
  return (
    <>
      {/*
        TODO: Investigate
        See https://github.com/google/web-stories-wp/issues/6671
        */}
      {/* eslint-disable-next-line styled-components-a11y/click-events-have-key-events, styled-components-a11y/no-static-element-interactions */}
      <ScreenMask
        data-testid="context-menu-mask"
        hasOnDismiss={Boolean(onDismiss)}
        onClick={onDismiss || noop}
      />
    </>
  );
}

Mask.propTypes = {
  onDismiss: PropTypes.func,
};
