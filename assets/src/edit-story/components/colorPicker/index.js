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
import { useEffect, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PatternPropType } from '../../types';
import useFocusOut from '../../utils/useFocusOut';
import { Close } from '../button';
import CurrentColorPicker from './currentColorPicker';
import useColor from './useColor';

const CONTAINER_PADDING = 15;
const HEADER_FOOTER_HEIGHT = 50;

const Container = styled.div`
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bg.v7};
  color: ${({ theme }) => theme.colors.fg.v1};
  width: 240px;
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  user-select: none;
`;

const Header = styled.div`
  height: ${HEADER_FOOTER_HEIGHT}px;
  padding: ${CONTAINER_PADDING}px;
  border-bottom: 1px solid ${({ theme }) => rgba(theme.colors.fg.v2, 0.2)};
  position: relative;
`;

const CloseButton = styled(Close)`
  opacity: 1;
  font-size: 15px;
  line-height: 20px;
  position: absolute;
  right: ${CONTAINER_PADDING}px;
  top: ${CONTAINER_PADDING}px;
`;

const Body = styled.div``;

function ColorPicker({ color, hasGradient, onChange, onClose }) {
  const {
    state: { currentColor, generatedColor },
    actions: { load, updateCurrentColor },
  } = useColor();

  useEffect(() => {
    if (generatedColor) {
      onChange(generatedColor);
    }
  }, [color, generatedColor, onChange]);

  useEffect(() => {
    if (color) {
      load(color);
    }
  }, [color, load]);

  const containerRef = useRef();
  const closeRef = useRef();
  const previousFocus = useRef(document.activeElement);

  useFocusOut(containerRef.current, onClose);

  useLayoutEffect(() => {
    closeRef.current.focus();
  }, []);

  useEffect(
    () => () => {
      // Notice the double arrow - this function runs on unmount.
      if (previousFocus.current) {
        // Re-focus old focus
        previousFocus.current.focus();
      }
    },
    []
  );

  return (
    <Container ref={containerRef}>
      {/* TODO: Make `hasGradient` do something */}
      <Header hasGradient={hasGradient}>
        <CloseButton
          ref={closeRef}
          width={10}
          height={10}
          aria-label={__('Close', 'web-stories')}
          onClick={onClose}
        />
      </Header>
      <Body>
        <CurrentColorPicker
          color={currentColor}
          onChange={updateCurrentColor}
        />
      </Body>
    </Container>
  );
}

ColorPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  hasGradient: PropTypes.bool,
  color: PatternPropType,
};

ColorPicker.defaultProps = {
  color: null,
  hasGradient: false,
};

export default ColorPicker;
