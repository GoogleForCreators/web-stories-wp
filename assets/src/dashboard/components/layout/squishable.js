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
import { useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import cssLerp from '../../utils/cssLerp';
import { Z_INDEX } from '../../constants';
import { END_SQUISH_LENGTH, SQUISH_LENGTH, SQUISH_CSS_VAR } from './provider';
import useLayoutContext from './useLayoutContext';
import useAddSquishVar from './useAddSquishVar';

const Squish = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding-top: ${cssLerp(
    `${SQUISH_LENGTH}px`,
    `${END_SQUISH_LENGTH}px`,
    SQUISH_CSS_VAR
  )};
  background-color: ${({ theme }) => theme.internalTheme.colors.white};
  z-index: ${Z_INDEX.LAYOUT_SQUISHABLE};
`;

const Content = styled.div`
  position: relative;
`;

const Squishable = ({ children }) => {
  const contentRef = useRef(null);
  const rootRef = useRef(null);
  useAddSquishVar(rootRef);

  const {
    actions: { setSquishContentHeight },
  } = useLayoutContext();

  useLayoutEffect(() => {
    const contentEl = contentRef.current;
    if (!contentEl) {
      return;
    }
    setSquishContentHeight(contentEl.offsetHeight + SQUISH_LENGTH);
  }, [setSquishContentHeight]);

  return (
    <Squish ref={rootRef}>
      <Content ref={contentRef}>{children}</Content>
    </Squish>
  );
};

Squishable.propTypes = {
  children: PropTypes.node,
};

export default Squishable;
