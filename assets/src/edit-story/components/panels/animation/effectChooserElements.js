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

export const DropAnimation = styled.div`
  display: inline-block;
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

export const FadeInAnimation = styled.div`
  display: inline-block;
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

export const FlyInLeftAnimation = styled.div`
  display: inline-block;
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

export const FlyInRightAnimation = styled.div`
  display: inline-block;
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

export const FlyInTopAnimation = styled.div`
  display: inline-block;
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

export const FlyInBottomAnimation = styled.div`
  display: inline-block;
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

export const PulseAnimation = styled.div`
  display: inline-block;
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

export const RotateInLeftAnimation = styled.div`
  display: inline-block;
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

export const RotateInRightAnimation = styled.div`
  display: inline-block;
  animation: ${rotateInRightKeyframes} 2s linear infinite;
`;
