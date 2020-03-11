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
import styled from 'styled-components';
import { CustomPicker } from 'react-color';
import { Saturation, Hue, Alpha } from 'react-color/lib/components/common';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Eyedropper } from '../button';
import Pointer from './pointer';
import EditablePreview from './editablePreview';

const CONTAINER_PADDING = 15;
const EYEDROPPER_ICON_SIZE = 15;
const HEADER_FOOTER_HEIGHT = 50;
const BODY_HEIGHT = 140;
const CONTROLS_WIDTH = 12;
const CONTROLS_BORDER_RADIUS = 6;

const Container = styled.div`
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  user-select: none;
`;

const Body = styled.div`
  padding-bottom: 0;
  display: grid;
  grid: 'saturation hue alpha' ${BODY_HEIGHT}px / 1fr ${CONTROLS_WIDTH}px ${CONTROLS_WIDTH}px;
  grid-gap: 10px;
`;

const SaturationWrapper = styled.div`
  position: relative;
  width: 167px;
  height: ${BODY_HEIGHT}px;
  grid-area: saturation;
`;

const HueWrapper = styled.div`
  position: relative;
  height: ${BODY_HEIGHT}px;
  width: ${CONTROLS_WIDTH}px;
  grid-area: hue;
`;

const AlphaWrapper = styled.div`
  position: relative;
  height: ${BODY_HEIGHT}px;
  width: ${CONTROLS_WIDTH}px;
  background: #fff;
  border-radius: ${CONTROLS_BORDER_RADIUS}px;
  grid-area: alpha;
`;

const Footer = styled.div`
  padding: ${CONTAINER_PADDING}px;
  height: ${HEADER_FOOTER_HEIGHT}px;
  font-size: ${CONTROLS_WIDTH}px;
  line-height: 19px;
  position: relative;
`;

const EyedropperWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: ${CONTAINER_PADDING}px;
`;

const EyedropperButton = styled(Eyedropper)`
  line-height: ${EYEDROPPER_ICON_SIZE}px;
`;

const CurrentWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  bottom: ${CONTAINER_PADDING}px;
`;

const CurrentAlphaWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: ${CONTAINER_PADDING}px;
`;

function CurrentColorPicker({ rgb, hsl, hsv, hex, onChange, showOpacity }) {
  const alphaPercentage = String(Math.round(rgb.a * 100));
  const hexValue = hex.substr(1);

  const handleFormatHex = useCallback((v) => `#${v}`, []);

  const handleHexInputChange = useCallback(
    (value) => onChange({ hex: value }),
    [onChange]
  );

  const handleFormatPercentage = useCallback((v) => `${v}%`, []);

  const handleOpacityInputChange = useCallback(
    (value) =>
      onChange({ ...rgb, a: isNaN(value) ? 1 : parseInt(value) / 100 }),
    [rgb, onChange]
  );

  return (
    <Container>
      <Body>
        <SaturationWrapper>
          <Saturation
            radius={`${CONTROLS_BORDER_RADIUS}px`}
            pointer={() => <Pointer offset={-6} currentColor={rgb} />}
            hsl={hsl}
            hsv={hsv}
            onChange={onChange}
          />
        </SaturationWrapper>
        <HueWrapper>
          <Hue
            direction="vertical"
            width={`${CONTROLS_WIDTH}px`}
            height={`${BODY_HEIGHT}px`}
            radius={`${CONTROLS_BORDER_RADIUS}px`}
            pointer={() => <Pointer offset={0} currentColor={rgb} />}
            hsl={hsl}
            onChange={onChange}
          />
        </HueWrapper>
        {showOpacity && (
          <AlphaWrapper>
            <Alpha
              direction="vertical"
              width={`${CONTROLS_WIDTH}px`}
              height={`${BODY_HEIGHT}px`}
              radius={`${CONTROLS_BORDER_RADIUS}px`}
              pointer={() => (
                <Pointer offset={-3} currentColor={rgb} withAlpha />
              )}
              rgb={rgb}
              hsl={hsl}
              onChange={onChange}
            />
          </AlphaWrapper>
        )}
      </Body>
      <Footer>
        {/* TODO: implement (see https://github.com/google/web-stories-wp/issues/262) */}
        <EyedropperWrapper>
          <EyedropperButton
            width={EYEDROPPER_ICON_SIZE}
            height={EYEDROPPER_ICON_SIZE}
            aria-label={__('Select color', 'web-stories')}
            isDisabled
          />
        </EyedropperWrapper>
        <CurrentWrapper>
          <EditablePreview
            label={__('Edit hex value', 'web-stories')}
            value={hexValue}
            onChange={handleHexInputChange}
            width={65}
            format={handleFormatHex}
          />
        </CurrentWrapper>
        {showOpacity && (
          <CurrentAlphaWrapper>
            <EditablePreview
              label={__('Edit opacity', 'web-stories')}
              value={alphaPercentage}
              width={35}
              format={handleFormatPercentage}
              onChange={handleOpacityInputChange}
            />
          </CurrentAlphaWrapper>
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
