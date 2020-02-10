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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Close, Eyedropper } from '../button';
import { Pointer, PointerWithOffset } from './pointer';
import EditableHexPreview from './editableHexPreview';

const Container = styled.div`
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bg.v7};
  color: ${({ theme }) => theme.colors.fg.v1};
  width: 240px;
  font-family: Poppins, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
`;

const Header = styled.div`
  height: 53px;
  padding: 16px;
  border-bottom: 1px solid rgba(229, 229, 229, 0.2);
  position: relative;
`;

const CloseButton = styled(Close)`
  opacity: 1;
  font-size: 15px;
  line-height: 20px;
  position: absolute;
  right: 16px;
  top: 16px;
`;

const Body = styled.div`
  padding: 16px;
  display: grid;
  grid: 'saturation hue alpha' 140px / 1fr 12px 12px;
  grid-gap: 10px;
`;

const SaturationWrapper = styled.div`
  position: relative;
  width: 167px;
  height: 140px;
  grid-area: saturation;
`;

const HueWrapper = styled.div`
  position: relative;
  height: 140px;
  width: 12px;
  grid-area: hue;
`;

const AlphaWrapper = styled.div`
  position: relative;
  height: 140px;
  width: 12px;
  grid-area: alpha;
`;

const Footer = styled.div`
  padding: 16px;
  height: 19px;
  line-height: 19px;
  position: relative;
`;

const EyedropperWrapper = styled.div`
  position: absolute;
  left: 15px;
  bottom: 15px;
`;

const EyedropperButton = styled(Eyedropper)`
  line-height: 15px;
`;

const CurrentWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  bottom: 15px;
`;

const CurrentAlphaWrapper = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
`;

function ColorPicker({ rgb, hsl, hsv, hex, onChange, onClose }) {
  const controlsProps = { rgb, hsl, hsv, hex, onChange };
  const { a: alpha } = rgb;

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
            pointer={PointerWithOffset}
            {...controlsProps}
          />
        </SaturationWrapper>
        <HueWrapper>
          <Hue
            direction="vertical"
            width="12px"
            height="140px"
            radius="6px"
            pointer={Pointer}
            {...controlsProps}
          />
        </HueWrapper>
        <AlphaWrapper>
          <Alpha
            direction="vertical"
            width="12px"
            height="140px"
            radius="6px"
            pointer={Pointer}
            {...controlsProps}
          />
        </AlphaWrapper>
      </Body>
      <Footer>
        {/* TODO: implement (see https://github.com/google/web-stories-wp/issues/262) */}
        <EyedropperWrapper>
          <EyedropperButton
            width={15}
            height={15}
            aria-label={__('Select color', 'web-stories')}
            isDisabled
          />
        </EyedropperWrapper>
        <CurrentWrapper>
          <EditableHexPreview {...controlsProps} />
        </CurrentWrapper>
        <CurrentAlphaWrapper>{alpha * 100 + '%'}</CurrentAlphaWrapper>
      </Footer>
    </Container>
  );
}

ColorPicker.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  rgb: PropTypes.object,
  hex: PropTypes.object,
  hsl: PropTypes.object,
  hsv: PropTypes.object,
};

export default CustomPicker(ColorPicker);
