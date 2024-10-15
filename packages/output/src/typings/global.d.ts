/*
 * Copyright 2023 Google LLC
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

import type * as React from 'react';

type AmpLayout =
  | 'fill'
  | 'fixed'
  | 'fixed-height'
  | 'flex-item'
  | 'intrinsic'
  | 'nodisplay'
  | 'responsive'
  | 'container';

interface AmpHTMLHtmlElement
  extends React.DetailedHTMLProps<
    React.HtmlHTMLAttributes<HTMLHtmlElement>,
    HTMLHtmlElement
  > {
  amp: string;
}

interface AmpVideo
  extends React.DetailedHTMLProps<
    Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'loop'>,
    HTMLVideoElement
  > {
  layout: AmpLayout;
  'captions-id'?: string;
  autoplay?: 'autoplay';
  loop?: 'loop';
}

interface AmpImg
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  layout: AmpLayout;
  'disable-inline-width'?: boolean;
}

interface AmpStory {
  standalone: '';
  title: string;
  publisher?: string;
  'publisher-logo-src': string;
  'poster-portrait-src': string;
  'background-audio'?: string;
  children?: React.ReactNode;
}

interface AmpStoryGridLayer {
  template: 'fill' | 'vertical';
  'aspect-ratio'?: string;
  class?: string;
  children?: React.ReactNode;
}

interface AmpStoryPage {
  id?: string;
  'auto-advance-after'?: string;
  'background-audio'?: string;
  children?: React.ReactNode;
}

interface AmpStoryShoppingAttachment {
  theme?: 'light' | 'dark';
  'cta-text'?: string;
  children?: React.ReactNode;
}

interface AmpStoryPageOutlink {
  theme?: 'light' | 'dark';
  layout: AmpLayout;
  'cta-image'?: string;
  children?: React.ReactNode;
}

interface AmpStoryCaptions {
  key: string;
  id: string;
  layout: AmpLayout;
}

declare module 'react' {
  interface HtmlHTMLAttributes<T> extends React.HTMLAttributes<T> {
    amp?: string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'amp-story': AmpStory;
      'amp-story-grid-layer': AmpStoryGridLayer;
      'amp-story-page': AmpStoryPage;
      'amp-story-page-outlink': AmpStoryPageOutlink;
      'amp-story-shopping-attachment': AmpStoryShoppingAttachment;
      'amp-story-captions': AmpStoryCaptions;
      'amp-video': AmpVideo;
      'amp-img': AmpImg;
    }
  }
}
