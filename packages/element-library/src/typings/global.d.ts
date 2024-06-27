/*
 * Copyright 2024 Google LLC
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

import type {
  CSSProperties,
  DetailedHTMLProps,
  ImgHTMLAttributes,
  VideoHTMLAttributes,
} from 'react';

type AmpLayout =
  | 'fill'
  | 'fixed'
  | 'fixed-height'
  | 'flex-item'
  | 'intrinsic'
  | 'nodisplay'
  | 'responsive'
  | 'container';

interface AmpVideo
  extends DetailedHTMLProps<
    Omit<VideoHTMLAttributes<HTMLVideoElement>, 'loop' | 'autoPlay'>,
    HTMLVideoElement
  > {
  layout: AmpLayout;
  'captions-id'?: string;
  autoPlay?: string;
  loop?: string;
  noaudio?: string;
  alt?: string;
}

interface AmpImg
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  layout: AmpLayout;
  'disable-inline-width'?: boolean;
}

interface AmpStoryShoppingTag {
  'data-product-id'?: string | number;
}

interface AmpStoryAudioSticker {
  sticker: 'headphone-cat' | 'tape-player' | 'loud-speaker' | 'audio-cloud';
  'sticker-style'?: 'none' | 'outline' | 'dropshadow';
  size: 'large' | 'small';
  style?: CSSProperties;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'amp-story-shopping-tag': AmpStoryShoppingTag;
      'amp-story-audio-sticker': AmpStoryAudioSticker;
      'amp-video': AmpVideo;
      'amp-img': AmpImg;
    }
  }
}

export {};
