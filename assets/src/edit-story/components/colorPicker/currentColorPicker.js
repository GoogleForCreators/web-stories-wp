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
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { CustomPicker } from 'react-color';
import { Saturation, Hue, Alpha } from 'react-color/lib/components/common';
import { useFeatures } from 'flagged';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Eyedropper } from '../button';
import Pointer from './pointer';
import EditablePreview from './editablePreview';

const CONTAINER_PADDING = 14;
const EYEDROPPER_ICON_SIZE = 15;
const HEADER_FOOTER_HEIGHT = 42;
const BODY_HEIGHT = 140;
const CONTROLS_HEIGHT = 28;
const CONTROLS_BORDER_RADIUS = 50;
const OPACITY_WIDTH = 64;
const HEX_WIDTH = 80;

const Container = styled.div`
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.family};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  user-select: none;
  padding: ${CONTAINER_PADDING}px;
  padding-bottom: 0px;
`;

const Body = styled.div`
  padding-bottom: 0;
`;

const SaturationWrapper = styled.div`
  position: relative;
  height: ${BODY_HEIGHT}px;
  margin-bottom: 16px;
`;

const wrapperCSS = css`
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.colors.shadow.active};
  height: ${CONTROLS_HEIGHT}px;
  position: relative;
  border-radius: ${CONTROLS_BORDER_RADIUS}px;
  background-clip: padding-box;
`;

const HueWrapper = styled.div`
  ${wrapperCSS}
`;

const AlphaWrapper = styled.div`
  background: #fff;
  ${wrapperCSS}
`;

const Footer = styled.div`
  height: ${HEADER_FOOTER_HEIGHT}px;
  line-height: 19px;
  position: relative;
  margin-top: 7px;
  display: grid;
  grid: 'eyedropper hex opacity' ${HEADER_FOOTER_HEIGHT}px / 64px 1fr ${OPACITY_WIDTH}px;
  grid-gap: 10px;
`;

const HexValue = styled.div`
  grid-area: hex;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${HEX_WIDTH}px;
`;

const EyedropperButton = styled(Eyedropper)`
  line-height: ${EYEDROPPER_ICON_SIZE}px;
  grid-area: eyedropper;
`;

const Opacity = styled.div`
  grid-area: opacity;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${OPACITY_WIDTH}px;
`;

function CurrentColorPicker({ rgb, hsl, hsv, hex, onChange, showOpacity }) {
  const alphaPercentage = String(Math.round(rgb.a * 100));
  const hexValue = hex[0] === '#' ? hex.substr(1) : hex;

  const handleFormatHex = useCallback((v) => `#${v}`, []);
  const handleFormatPercentage = useCallback((v) => `${v}%`, []);

  const handleHexInputChange = useCallback(
    (value) => onChange({ hex: value }),
    [onChange]
  );

  const handleOpacityInputChange = useCallback(
    (value) =>
      onChange({ ...rgb, a: isNaN(value) ? 1 : parseInt(value) / 100 }),
    [rgb, onChange]
  );

  const { eyeDropper } = useFeatures();

  return (
    <Container>
      <Body showOpacity={showOpacity}>
        <SaturationWrapper>
          <Saturation
            radius="8px"
            pointer={() => (
              <Pointer offsetX={-12} offsetY={-12} currentColor={rgb} />
            )}
            hsl={hsl}
            hsv={hsv}
            onChange={onChange}
          />
        </SaturationWrapper>
        <HueWrapper>
          <Hue
            direction="horizontal"
            height={`${CONTROLS_HEIGHT}px`}
            radius={`${CONTROLS_BORDER_RADIUS}px`}
            pointer={() => (
              <Pointer offsetX={-12} offsetY={1} currentColor={rgb} />
            )}
            hsl={hsl}
            onChange={onChange}
          />
        </HueWrapper>
        {showOpacity && (
          <AlphaWrapper>
            <Alpha
              direction="horizontal"
              height={`${CONTROLS_HEIGHT}px`}
              radius={`${CONTROLS_BORDER_RADIUS}px`}
              pointer={() => (
                <Pointer
                  offsetX={-12}
                  offsetY={1}
                  currentColor={rgb}
                  withAlpha
                />
              )}
              rgb={rgb}
              hsl={hsl}
              onChange={onChange}
            />
          </AlphaWrapper>
        )}
      </Body>
      <Footer>
        {eyeDropper && (
          <EyedropperButton
            width={EYEDROPPER_ICON_SIZE}
            height={EYEDROPPER_ICON_SIZE}
            aria-label={__('Select color', 'web-stories')}
            isDisabled
          />
        )}
        <HexValue>
          <EditablePreview
            label={__('Edit hex value', 'web-stories')}
            value={hexValue}
            onChange={handleHexInputChange}
            width={80}
            format={handleFormatHex}
          />
        </HexValue>
        {showOpacity && (
          <Opacity>
            {/* @todo This needs % as suffix */}
            <EditablePreview
              label={__('Edit opacity', 'web-stories')}
              value={alphaPercentage}
              width={OPACITY_WIDTH}
              format={handleFormatPercentage}
              onChange={handleOpacityInputChange}
            />
          </Opacity>
        )}
      </Footer>
    </Container>
  );
}

CurrentColorPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  showOpacity: PropTypes.bool,
  rgb: PropTypes.object,
  hex: PropTypes.string,
  hsl: PropTypes.object,
  hsv: PropTypes.object,
};

CurrentColorPicker.defaultProps = {
  showOpacity: true,
};

export default CustomPicker(CurrentColorPicker);
