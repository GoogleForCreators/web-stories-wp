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
import styled, { keyframes } from 'styled-components';

export const GRID_ITEM_HEIGHT = 64;
export const PANEL_WIDTH = 276;

export const BaseAnimationCell = styled.div`
  display: none;
`;

const dropKeyframes = keyframes`
  0% {
    transform: translateY(-100%);
    animation-timing-function: cubic-bezier(.75,.05,.86,.08);
  }
  15% {
    transform: translateY(0%);
    animation-timing-function: cubic-bezier(.22,.61,.35,1);
  }
  26% {
    transform: translateY(-62%);
    animation-timing-function: cubic-bezier(.75,.05,.86,.08);
  }
  37% {
    transform: translateY(-0%);
    animation-timing-function: cubic-bezier(.22,.61,.35,1);
  }
  41.5% {
    transform: translateY(-30%);
    animation-timing-function: cubic-bezier(.75,.05,.86,.08);
  }
  50%, 100% {
    transform: translateY(0%);
    animation-timing-function: cubic-bezier(.22,.61,.35,1);
  }
`;

export const DropAnimation = styled(BaseAnimationCell)`
  animation: ${dropKeyframes} 3.2s linear infinite;
`;

const fadeInKeyframes = keyframes`
  0% {
    opacity: 0;
  }
  50%, 100% {
    opacity: 1;
  }
`;

export const FadeInAnimation = styled(BaseAnimationCell)`
  animation: ${fadeInKeyframes} 2.5s linear infinite;
`;

const flyInLeftKeyframes = keyframes`
  0% {
    transform: translateX(-100%);
  }
  50%, 100% {
    transform: translateX(0%);
  }
`;

export const FlyInLeftAnimation = styled(BaseAnimationCell)`
  animation: ${flyInLeftKeyframes} 2s linear infinite;
`;

const flyInRightKeyframes = keyframes`
  0% {
    transform: translateX(100%);
  }
  50%, 100% {
    transform: translateX(0%);
  }
`;

export const FlyInRightAnimation = styled(BaseAnimationCell)`
  animation: ${flyInRightKeyframes} 2s linear infinite;
`;

const flyInTopKeyframes = keyframes`
  0% {
    transform: translateY(-100%);
  }
  50%, 100% {
    transform: translateY(0%);
  }
`;

export const FlyInTopAnimation = styled(BaseAnimationCell)`
  animation: ${flyInTopKeyframes} 2s linear infinite;
`;

const flyInBottomKeyframes = keyframes`
  0% {
    transform: translateY(100%);
  }
  50%, 100% {
    transform: translateY(0%);
  }
`;

export const FlyInBottomAnimation = styled(BaseAnimationCell)`
  animation: ${flyInBottomKeyframes} 2s linear infinite;
`;

const pulseKeyframes = keyframes`
  0% {
    transform: scale(1);
  }
  12.5% {
    transform: scale(0.75);
  }
  37.5% {
    transform: scale(1.25);
  }
  50%, 100% {
    transform: scale(1);
  }
`;

export const PulseAnimation = styled(BaseAnimationCell)`
  animation: ${pulseKeyframes} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
`;

const rotateInLeftKeyframes = keyframes`
  0% {
    transform: translateX(-100%) rotate(360deg);
  }
  50%, 100% {
    transform: translateX(0%);
  }
`;

export const RotateInLeftAnimation = styled(BaseAnimationCell)`
  animation: ${rotateInLeftKeyframes} 2s linear infinite;
`;

const rotateInRightKeyframes = keyframes`
  0% {
    transform: translateX(100%) rotate(-360deg);
  }
  50%, 100% {
    transform: translateX(0%);
  }
`;

export const RotateInRightAnimation = styled(BaseAnimationCell)`
  animation: ${rotateInRightKeyframes} 2s linear infinite;
`;

const twirlInKeyframes = keyframes`
  0% {
    transform: rotate(-540deg) scale(0.1);
    opacity: 0;
  }
  50%, 100% {
    transform: none;
    opacity: 1;
  }
`;

export const TwirlInAnimation = styled(BaseAnimationCell)`
  animation: ${twirlInKeyframes} 2s cubic-bezier(0.2, 0.75, 0.4, 1) infinite;
`;

const whooshInLeftKeyframes = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50%, 100% {
    transform: translateX(0%);
    opacity: 1;
  }
`;

export const WhooshInLeftAnimation = styled(BaseAnimationCell)`
  animation: ${whooshInLeftKeyframes} 2s cubic-bezier(0, 0, 0.2, 1) infinite;
`;

const whooshInRightKeyframes = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  50%, 100% {
    transform: translateX(0%);
    opacity: 1;
  }
`;

export const WhooshInRightAnimation = styled(BaseAnimationCell)`
  animation: ${whooshInRightKeyframes} 2s cubic-bezier(0, 0, 0.2, 1) infinite;
`;

const panLeftKeyframes = keyframes`
  0% {
    transform: translateX(-100%) scale(1.5);
  }
  50%, 100% {
    transform: translateX(200%) scale(1.5);
  }
`;

export const PanLeftAnimation = styled(BaseAnimationCell)`
  animation: ${panLeftKeyframes} 3s linear infinite;
`;

const panRightKeyframes = keyframes`
  0% {
    transform: translateX(100%) scale(1.5);
  }
  50%, 100% {
    transform: translateX(-200%) scale(1.5);
  }
`;

export const PanRightAnimation = styled(BaseAnimationCell)`
  animation: ${panRightKeyframes} 3s linear infinite;
`;

const panTopKeyframes = keyframes`
  0% {
    transform: translateY(-100%) scale(1.5);
  }
  50%, 100% {
    transform: translateY(200%) scale(1.5);
  }
`;

export const PanTopAnimation = styled(BaseAnimationCell)`
  animation: ${panTopKeyframes} 3s linear infinite;
`;

const panBottomKeyframes = keyframes`
  0% {
    transform: translateY(100%) scale(1.5);
  }
  50%, 100% {
    transform: translateY(-200%) scale(1.5);
  }
`;

export const PanBottomAnimation = styled(BaseAnimationCell)`
  animation: ${panBottomKeyframes} 3s linear infinite;
`;

const zoomInKeyframes = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50%, 100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const ZoomInAnimation = styled(BaseAnimationCell)`
  animation: ${zoomInKeyframes} 2s linear infinite;
`;

const zoomOutKeyframes = keyframes`
  0% {
    opacity: 0;
    transform: scale(2);
  }
  50%, 100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const ZoomOutAnimation = styled(BaseAnimationCell)`
  animation: ${zoomOutKeyframes} 2s linear infinite;
`;
