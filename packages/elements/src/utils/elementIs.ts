/*
 * Copyright 2022 Google LLC
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
import type { Draft } from 'immer';

/**
 * Internal dependencies
 */
import type {
  BackgroundableElement,
  DefaultBackgroundElement,
  Element,
  GifElement,
  LinkableElement,
  MediaElement,
  ProductElement,
  SequenceMediaElement,
  StickerElement,
  TextElement,
  VideoElement,
} from '../types';
import { ElementType } from '../types';

function isMediaElement(e: Element): e is MediaElement;
function isMediaElement(e: Draft<Element>): e is Draft<MediaElement>;
function isMediaElement(e: Element): e is MediaElement {
  return 'resource' in e && Boolean(e.resource);
}

function isTextElement(e: Element): e is TextElement;
function isTextElement(e: Draft<Element>): e is Draft<TextElement>;
function isTextElement(e: Element): e is TextElement {
  return 'font' in e && Boolean(e.font);
}

function isDefaultBackgroundElement(e: Element): e is DefaultBackgroundElement;
function isDefaultBackgroundElement(
  e: Draft<Element>
): e is Draft<DefaultBackgroundElement>;
function isDefaultBackgroundElement(e: Element): e is DefaultBackgroundElement {
  return 'isDefaultBackground' in e && Boolean(e.isDefaultBackground);
}

function isBackgroundable(e: Element): e is BackgroundableElement;
function isBackgroundable(e: Draft<Element>): e is Draft<BackgroundableElement>;
function isBackgroundable(e: Element): e is BackgroundableElement {
  // All media is backgroundable.
  return (
    // Property can be undefined if e is of type Draft<Element>.
    ('isBackground' in e && typeof e.isBackground !== 'undefined') ||
    isMediaElement(e)
  );
}

function isProduct(e: Element): e is ProductElement;
function isProduct(e: Draft<Element>): e is Draft<ProductElement>;
function isProduct(e: Element): e is ProductElement {
  return 'product' in e && Boolean(e.product);
}

function isSequenceMediaElement(e: MediaElement): e is SequenceMediaElement;
function isSequenceMediaElement(
  e: Draft<MediaElement>
): e is Draft<SequenceMediaElement>;
function isSequenceMediaElement(e: MediaElement): e is SequenceMediaElement {
  return 'poster' in e.resource && Boolean(e.resource.poster);
}

function isSticker(e: Element): e is StickerElement {
  return 'sticker' in e && Boolean(e.sticker);
}

function isVideo(e: Draft<Element>): e is Draft<VideoElement>;
function isVideo(e: Element): e is VideoElement {
  return (
    isMediaElement(e) &&
    isSequenceMediaElement(e) &&
    e.type === ElementType.Video
  );
}

function isGif(e: Draft<Element>): e is Draft<GifElement>;
function isGif(e: Element): e is GifElement {
  return (
    isMediaElement(e) && isSequenceMediaElement(e) && e.type === ElementType.Gif
  );
}

function isLinkable(e: Element): e is LinkableElement;
function isLinkable(e: Draft<Element>): e is Draft<LinkableElement>;
function isLinkable(e: Element): e is LinkableElement {
  return (
    'link' in e && typeof e.link !== 'undefined' && e.link?.url?.length > 0
  );
}

const elementIs = {
  media: isMediaElement,
  text: isTextElement,
  defaultBackground: isDefaultBackgroundElement,
  backgroundable: isBackgroundable,
  product: isProduct,
  sequenceMedia: isSequenceMediaElement,
  sticker: isSticker,
  video: isVideo,
  gif: isGif,
  linkable: isLinkable,
};

export default elementIs;
