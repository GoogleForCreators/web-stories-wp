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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CustomPicker } from 'react-color';
import { Saturation, Hue, Alpha } from 'react-color/lib/components/common';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Close, Eyedropper } from '../button';
import Pointer from './pointer';
import EditableHexPreview from './editableHexPreview';

const CONTAINER_PADDING = 15;
const EYEDROPPER_ICON_SIZE = 15;
const HEADER_FOOTER_HEIGHT = 50;
const BODY_HEIGHT = 140;
const CONTROLS_WIDTH = 12;

const Container = styled.div`
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bg.v7};
  color: ${({ theme }) => theme.colors.fg.v1};
  width: 240px;
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
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

const Body = styled.div`
  padding: ${CONTAINER_PADDING}px;
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
  border-radius: 6px;
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
  left: ${CONTAINER_PADDING}px;
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
  right: ${CONTAINER_PADDING}px;
  bottom: ${CONTAINER_PADDING}px;
`;

function ColorPicker({ rgb, hsl, hsv, hex, onChange, onClose }) {
  const controlsProps = { rgb, hsl, hsv, hex, onChange };
  const alphaPercentage = Math.round(rgb.a * 100);

  return (
    <Container>
      <Header>
        <CloseButton
          width={10}
          height={10}
          aria-label={__('Close', 'web-stories')}
          onClick={onClose}
        />
      </Header>
      <Body>
        <SaturationWrapper>
          <Saturation
            radius="6px"
            pointer={() => <Pointer offset={-6} />}
            {...controlsProps}
          />
        </SaturationWrapper>
        <HueWrapper>
          <Hue
            direction="vertical"
            width={`${CONTROLS_WIDTH}px`}
            height={`${BODY_HEIGHT}px`}
            radius="6px"
            pointer={() => <Pointer offset={0} />}
            {...controlsProps}
          />
        </HueWrapper>
        <AlphaWrapper>
          <Alpha
            direction="vertical"
            width={`${CONTROLS_WIDTH}px`}
            height={`${BODY_HEIGHT}px`}
            radius="6px"
            pointer={() => <Pointer offset={-3} />}
            {...controlsProps}
          />
        </AlphaWrapper>
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
          <EditableHexPreview {...controlsProps} />
        </CurrentWrapper>
        <CurrentAlphaWrapper>{alphaPercentage + '%'}</CurrentAlphaWrapper>
      </Footer>
    </Container>
  );
}

ColorPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  rgb: PropTypes.object,
  hex: PropTypes.string,
  hsl: PropTypes.object,
  hsv: PropTypes.object,
};

export default CustomPicker(ColorPicker);
