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
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
} from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { __ } from '@web-stories-wp/i18n';

const Saturation = lazy(() =>
  import(
    /* webpackChunkName: "chunk-react-color" */ 'react-color/lib/components/common'
  ).then((module) => ({ default: module.Saturation }))
);
const Hue = lazy(() =>
  import(
    /* webpackChunkName: "chunk-react-color" */ 'react-color/lib/components/common'
  ).then((module) => ({ default: module.Hue }))
);
const Alpha = lazy(() =>
  import(
    /* webpackChunkName: "chunk-react-color" */ 'react-color/lib/components/common'
  ).then((module) => ({ default: module.Alpha }))
);

/**
 * Internal dependencies
 */
import {
  Icons,
  Button,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
} from '@web-stories-wp/design-system';
import CircularProgress from '../circularProgress';
import useEyedropper from '../eyedropper';
import Pointer from './pointer';
import EditablePreview from './editablePreview';

const CONTAINER_PADDING = 16;
const HEADER_FOOTER_HEIGHT = 36;
const BODY_HEIGHT = 156;
const CONTROLS_HEIGHT = 28;
const CONTROLS_BORDER_RADIUS = 50;
const OPACITY_WIDTH = 52;
const HEX_WIDTH = 74;

const Container = styled.div`
  user-select: none;
  padding: 0 ${CONTAINER_PADDING}px;
`;

const Body = styled.div`
  padding-bottom: 0;
`;

const BodyFallback = styled.div`
  height: ${BODY_HEIGHT + 3 * CONTROLS_HEIGHT + 4 * CONTAINER_PADDING}px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  ${wrapperCSS}
  div:first-child div:first-child div:first-child {
    background-image: conic-gradient(
      ${({ theme }) => theme.colors.fg.tertiary} 0.25turn,
      transparent 0turn 0.5turn,
      ${({ theme }) => theme.colors.fg.tertiary} 0turn 0.75turn,
      transparent 0turn 1turn
    ) !important;
    background-size: 8px 8px !important;
  }
`;

const Footer = styled.div`
  height: ${HEADER_FOOTER_HEIGHT}px;
  line-height: 19px;
  position: relative;
  margin-top: 7px;
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
`;

const HexValue = styled.div`
  width: ${HEX_WIDTH}px;
`;

const Opacity = styled.div`
  width: ${OPACITY_WIDTH}px;
`;

function CurrentColorPicker({ rgb, hsl, hsv, hex, onChange, showOpacity }) {
  const alphaPercentage = String(Math.round(rgb.a * 100));
  const hexValue = hex[0] === '#' ? hex.substr(1) : hex;

  const handleFormatHex = useCallback((v) => {
    if ('transparent' === v) {
      v = '000000';
    }
    return `#${v}`;
  }, []);
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

  const { initEyedropper } = useEyedropper({
    onChange,
  });

  return (
    <Container data-testid="colorPicker">
      <Body showOpacity={showOpacity}>
        <Suspense fallback={null}>
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
        </Suspense>
      </Body>
      <Footer>
        <Button
          variant={BUTTON_VARIANTS.SQUARE}
          type={BUTTON_TYPES.QUATERNARY}
          size={BUTTON_SIZES.SMALL}
          aria-label={__('Pick a color from canvas', 'web-stories')}
          onClick={initEyedropper()}
          onPointerEnter={initEyedropper(false)}
        >
          <Icons.Pipette />
        </Button>
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

const DynamicImportWrapper = () => {
  return (...args) => {
    function DynamicFetcher(props) {
      const isMounted = useRef(false);
      const [Picker, setPicker] = useState(null);

      useEffect(() => {
        isMounted.current = true;
        import(/* webpackChunkName: "chunk-react-color" */ 'react-color').then(
          ({ CustomPicker }) => {
            if (isMounted.current) {
              setPicker({ component: CustomPicker(...args) });
            }
          }
        );

        return () => {
          isMounted.current = false;
        };
      }, []);

      return Picker ? (
        <Picker.component {...props} />
      ) : (
        <BodyFallback>
          <CircularProgress />
        </BodyFallback>
      );
    }
    return DynamicFetcher;
  };
};

const DynamicHOC = DynamicImportWrapper();
export default DynamicHOC(CurrentColorPicker);
