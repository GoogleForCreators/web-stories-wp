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
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
/**
 * Internal dependencies
 */
import { SQUISH_LENGTH } from './provider';
import useLayoutContext from './useLayoutContext';

const lerp = (start, end, progress) => {
  return `calc(calc(calc(1 - var(${progress}, 0)) * ${start}) + calc(var(${progress}, 0) * ${end}))`;
};

const Squish = styled.div`
  contain: content;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding-top: ${lerp(`${SQUISH_LENGTH}px`, '0px', '--progress')};
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 2;
`;

const Content = styled.div`
  position: relative;
`;

const Squishable = ({ children }) => {
  const contentRef = useRef(null);
  const cssVarScope = useRef(null);
  const {
    actions: { addSquishListener, removeSquishListener },
  } = useLayoutContext();

  useEffect(() => {
    const cssVarEl = cssVarScope.current;
    if (!cssVarEl) {
      return () => {};
    }

    const handleSquish = (event) => {
      cssVarEl.style.setProperty('--progress', event.data.progress);
    };

    addSquishListener(handleSquish);
    return () => {
      removeSquishListener(handleSquish);
    };
  }, [addSquishListener, removeSquishListener]);

  return (
    <Squish ref={cssVarScope}>
      <Content ref={contentRef}>{children}</Content>
    </Squish>
  );
};

Squishable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Squishable;
