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
import { useState } from '@wordpress/element';
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

const ModesList = styled.ul.attrs({ role: 'tablist' })`
  padding: 0;
  margin: 0;
  display: flex;
  list-style: none;
`;

const ModeListItem = styled.li.attrs({ role: 'tab' })`
  width: 20px;
  height: 20px;

  & + li {
    margin-left: 22px;
  }
`;

const Circle = styled.button`
  background: none;
  border: none;
  padding: 0;
  border-radius: 100%;
  width: 100%;
  height: 100%;
`;

const SolidColor = styled(Circle)`
  background: ${({ color }) => (color ? color : '#808080')};
`;

const LinearGradient = styled(Circle)`
  border: 1px solid #808080;
  background: linear-gradient(
    180deg,
    #fff 10.94%,
    ${({ color }) => color} 100%
  );
`;

const RadialGradient = styled(Circle)`
  border: 1px solid #808080;
  background: radial-gradient(
    50% 50% at 50% 50%,
    #fff 0%,
    ${({ color }) => color} 100%
  );
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

function ColorPicker({ rgb, hsl, hsv, hex, onChange, onClose, withGradients }) {
  const controlsProps = { rgb, hsl, hsv, hex, onChange };
  const { a: alpha } = rgb;

  const [currentMode, setCurrentMode] = useState('solid');

  const displayHeader = withGradients || onClose;

  return (
    <Container>
      {displayHeader && (
        <Header>
          {withGradients && (
            <ModesList>
              {['solid', 'linear', 'radial'].map((mode) => {
                const value = mode === currentMode ? hex : null;

                return (
                  <ModeListItem key={mode}>
                    {'solid' === mode && (
                      <SolidColor
                        color={value}
                        onClick={() => setCurrentMode(mode)}
                        aria-label={__('Solid color', 'web-stories')}
                      />
                    )}
                    {'linear' === mode && (
                      <LinearGradient
                        color={value || '#808080'}
                        onClick={() => setCurrentMode(mode)}
                        aria-label={__('Linear gradient', 'web-stories')}
                      />
                    )}
                    {'radial' === mode && (
                      <RadialGradient
                        color={value || '#3A3A3A'}
                        onClick={() => setCurrentMode(mode)}
                        aria-label={__('Radial gradient', 'web-stories')}
                      />
                    )}
                  </ModeListItem>
                );
              })}
            </ModesList>
          )}
          {onClose && (
            <CloseButton
              width={10}
              height={10}
              aria-label={__('Close', 'web-stories')}
              onClick={onClose}
            />
          )}
        </Header>
      )}
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
  withGradients: PropTypes.bool,
  rgb: PropTypes.object,
  hex: PropTypes.object,
  hsl: PropTypes.object,
  hsv: PropTypes.object,
};

ColorPicker.defaultProps = {
  withGradients: true,
};

export default CustomPicker(ColorPicker);
