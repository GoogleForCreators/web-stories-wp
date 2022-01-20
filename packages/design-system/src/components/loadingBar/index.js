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
import { CSSTransition } from 'react-transition-group';
import styled, { keyframes } from 'styled-components';
import { useRef } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import { themeHelpers } from '../../theme';

export const LOADING_INDICATOR_CLASS = 'loading-indicator';

const AriaOnlyAlert = styled.span(themeHelpers.visuallyHidden);

const gradientAnimation = keyframes`
    0% { background-position:0% 50% }
    50% { background-position:100% 50% }
    100% { background-position:0% 50% }
`;

const UploadingIndicator = styled.div`
  height: 4px;
  background: ${({ theme }) => theme.colors.gradient.loading};
  background-size: 400% 400%;
  position: absolute;
  bottom: 0px;
  border-radius: ${({ theme }) =>
    `0px 0px ${theme.borders.radius.small} ${theme.borders.radius.small}`};

  animation: ${gradientAnimation} 4s ease infinite;

  &.${LOADING_INDICATOR_CLASS} {
    &.appear {
      width: 0;
    }

    &.appear-done {
      width: 100%;
      transition: 1s ease-out;
      transition-property: width;
    }
  }
`;

export const LoadingBar = ({ loadingMessage, ...rest }) => {
  const nodeRef = useRef();
  return (
    <>
      {loadingMessage && (
        <AriaOnlyAlert role="status">{loadingMessage}</AriaOnlyAlert>
      )}
      <CSSTransition
        nodeRef={nodeRef}
        in
        appear
        timeout={0}
        className={LOADING_INDICATOR_CLASS}
      >
        <UploadingIndicator ref={nodeRef} {...rest} />
      </CSSTransition>
    </>
  );
};

LoadingBar.propTypes = {
  loadingMessage: PropTypes.string,
};
