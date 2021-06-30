/*
 * Copyright 2021 Google LLC
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
import styled from 'styled-components';
import { rgba, readableColor } from 'polished';
import { FULLBLEED_RATIO } from '@web-stories-wp/units';

/**
 * Internal dependencies
 */
import { useCanvas, useLayout } from '../../app';
import { useFocusOut, useKeyDownEffect } from '../../../design-system';
import { Layer, PageArea } from './layout';
import getColorFromPixelData from './utils/getColorFromPixelData';

const EyedropperBackground = styled(Layer)`
  background: rgba(0, 0, 0, 0.7);
  cursor: not-allowed;
  z-index: 2;
`;

const DisplayPageArea = styled(PageArea)`
  position: absolute;
`;

const EyedropperCanvas = styled.div`
  background: transparent;
  border-radius: 5px;
  color: black;
  position: absolute;
  z-index: 2;
  transform: translateZ(0);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  cursor: default;
`;

const ColorInfo = styled.div`
  position: absolute;
  text-transform: uppercase;
  transform: translateX(-50%);
  padding: 9px;
  min-width: 102px;
  text-align: center;
`;

const MagnifierCanvas = styled.canvas`
  border: 2px solid black;
  border-radius: 50%;
  transform: translate(calc(-50% + 4px), 20px);
  background: ${({ theme }) => theme.colors.bg.primary};
`;

const Magnifier = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  transform: translateY(-1000px);
  pointer-events: none;
`;

function EyedropperLayer() {
  const {
    fullbleedContainer,
    eyedropperActive,
    eyedropperCallback,
    eyedropperImg,
    eyedropperPixelData,
    setEyedropperActive,
  } = useCanvas(
    ({
      state: {
        fullbleedContainer,
        eyedropperActive,
        eyedropperCallback,
        eyedropperImg,
        eyedropperPixelData,
      },
      actions: { setEyedropperActive },
    }) => ({
      fullbleedContainer,
      eyedropperActive,
      eyedropperCallback,
      eyedropperImg,
      eyedropperPixelData,
      setEyedropperActive,
    })
  );

  const { pageWidth } = useLayout(({ state: { pageWidth } }) => ({
    pageWidth,
  }));

  const fullHeight = pageWidth / FULLBLEED_RATIO;
  const img = eyedropperImg;
  const imgRef = useRef();
  const magnifier = useRef();
  const magnifierInfo = useRef();
  const magnifierColor = useRef();

  useEffect(() => {
    const canvas = magnifier.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
    }
  }, [eyedropperImg]);

  const eyedropperCanvas = useRef();

  const closeEyedropper = () => setEyedropperActive(false);

  useFocusOut(eyedropperCanvas, closeEyedropper, [eyedropperActive, img]);

  useKeyDownEffect(document.body, 'esc', closeEyedropper);

  if (!eyedropperActive || !img) {
    return null;
  }

  const magnifierSize = 200; // We can use scroll wheel to control it?
  const magnifierPixels = 7;
  const magnifierRectSize = magnifierSize / magnifierPixels;

  const magnify = function (x, y) {
    const canvas = magnifier.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');

      // Sometimes initial setting is not enough.
      ctx.imageSmoothingEnabled = false;
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;

      // Draw enlarged cropped image.
      ctx.clearRect(0, 0, magnifierSize, magnifierSize);
      ctx.drawImage(
        imgRef.current,
        Math.round(x - magnifierPixels / 2),
        Math.round(y - magnifierPixels / 2),
        magnifierPixels,
        magnifierPixels,
        0,
        0,
        magnifierSize,
        magnifierSize
      );

      // Draw center rectangle for better aiming.
      ctx.beginPath();
      ctx.rect(
        Math.round(magnifierSize / 2) - magnifierRectSize / 2,
        Math.round(magnifierSize / 2) - magnifierRectSize / 2,
        magnifierRectSize,
        magnifierRectSize
      );
      ctx.stroke();
    }
  };

  const onMouseMove = (e) => {
    const { left, top, width, height } =
      fullbleedContainer.getBoundingClientRect();
    const x = (e.clientX - left) * (pageWidth / width);
    const y = (e.clientY - top) * (fullHeight / height);

    if (x < 0 || y < 0 || x > width || y > height) {
      return;
    }

    // Move magnifier canvas.
    magnifierInfo.current.style.transform = `translate(${x}px, ${y}px)`;

    // Redraw magnifier canvas.
    magnify(x, y);

    // Get and print pixel color.
    const rgbaObject = getColorFromPixelData(eyedropperPixelData, x, y, width);
    const { r, g, b, a } = rgbaObject;
    const hex = rgba(r, g, b, a);
    magnifierColor.current.style.background = `rgba(${r},${g},${b},${a})`;
    magnifierColor.current.style.color = readableColor(
      hex,
      '#333',
      '#EDEDED',
      false
    );
    magnifierColor.current.innerText = hex;
  };

  const onClick = (e) => {
    const { left, top, width, height } =
      fullbleedContainer.getBoundingClientRect();
    const x = (e.clientX - left) * (pageWidth / width);
    const y = (e.clientY - top) * (fullHeight / height);

    const rgbaObject = getColorFromPixelData(
      eyedropperPixelData,
      x,
      y,
      pageWidth
    );
    eyedropperCallback(rgbaObject);
  };

  return (
    <EyedropperBackground>
      {/* Remove the safezone so we don't have to move the canvas image up (we have fullbleed image). */}
      <DisplayPageArea withSafezone={false} showOverflow>
        {/* eslint-disable-next-line styled-components-a11y/click-events-have-key-events, styled-components-a11y/no-static-element-interactions */}
        <EyedropperCanvas
          ref={eyedropperCanvas}
          onClick={onClick}
          onMouseMove={onMouseMove}
        >
          <img ref={imgRef} src={img} alt="" />
          <Magnifier ref={magnifierInfo}>
            <MagnifierCanvas
              ref={magnifier}
              width={magnifierSize}
              height={magnifierSize}
            />
            <ColorInfo
              style={{
                top: magnifierSize + 20 + 10,
              }}
              ref={magnifierColor}
            />
          </Magnifier>
        </EyedropperCanvas>
      </DisplayPageArea>
    </EyedropperBackground>
  );
}

export default EyedropperLayer;
