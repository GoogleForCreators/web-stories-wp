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
import { useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Close } from '../button';

const CONTAINER_PADDING = 12;
const HEADER_FOOTER_HEIGHT = 52;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: ${HEADER_FOOTER_HEIGHT}px;
  padding: ${CONTAINER_PADDING}px;
  position: relative;
`;

const CloseButton = styled(Close)`
  opacity: 1;
  font-size: 15px;
  line-height: 20px;
  margin-left: auto;
`;

const TypeSelector = styled.button`
  width: 22px;
  height: 22px;
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.shadow.active};
  border: 0;
  border-radius: 100px;
  opacity: 1;
  margin-right: 22px;
`;

const Solid = styled(TypeSelector)`
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.accent.secondary : theme.colors.fg.tertiary};
`;

const Linear = styled(TypeSelector)`
  background: linear-gradient(
    180deg,
    ${({ isActive, theme }) =>
      isActive
        ? '#A4CBFF 0%, #255CA4 100%'
        : `rgba(255, 255, 255, 0.52) 0%, ${theme.colors.opacity.footprint} 106.28%`}
  );
`;

const Radial = styled(TypeSelector)`
  background: radial-gradient(
    97.5% 97.5% at 50% 50%,
    ${({ isActive, theme }) =>
      isActive
        ? `${theme.colors.accent.secondary} 0%, rgba(121, 179, 255, 0.13) 57.29%`
        : `${theme.colors.opacity.white64} 0%, rgba(255, 255, 255, 0) 57.29%`}
  );
`;

function Header({ type, hasGradient, setToGradient, setToSolid, onClose }) {
  const setToLinear = useCallback(() => setToGradient('linear'), [
    setToGradient,
  ]);
  const setToRadial = useCallback(() => setToGradient('radial'), [
    setToGradient,
  ]);

  const solid = useRef();
  useEffect(() => {
    solid.current.focus();
  }, []);

  return (
    <Wrapper>
      <Solid
        ref={solid}
        isActive={type === 'solid'}
        onClick={setToSolid}
        aria-label={__('Solid pattern type', 'web-stories')}
      />
      {hasGradient && (
        <>
          <Linear
            isActive={type === 'linear'}
            onClick={setToLinear}
            aria-label={__('Linear gradient pattern type', 'web-stories')}
          />
          <Radial
            isActive={type === 'radial'}
            onClick={setToRadial}
            aria-label={__('Radial gradient pattern type', 'web-stories')}
          />
        </>
      )}
      <CloseButton
        width={10}
        height={10}
        aria-label={__('Close', 'web-stories')}
        onClick={onClose}
      />
    </Wrapper>
  );
}

Header.propTypes = {
  type: PropTypes.string.isRequired,
  hasGradient: PropTypes.bool.isRequired,
  setToGradient: PropTypes.func.isRequired,
  setToSolid: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Header;
