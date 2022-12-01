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
 * Internal dependencies
 */
import type {
  BackgroundableElement,
  DefaultBackgroundElement,
  Element,
  MediaElement,
  TextElement,
  ProductElement,
  SequenceMediaElement,
} from '../types';

function isMediaElement(e: Element): e is MediaElement {
  return 'resource' in e;
}

function isTextElement(e: Element): e is TextElement {
  return 'font' in e;
}

function isDefaultBackgroundElement(e: Element): e is DefaultBackgroundElement {
  return 'isDefaultBackground' in e;
}

function isBackgroundable(e: Element): e is BackgroundableElement {
  // All media is backgroundable.
  return 'isBackground' in e || 'resource' in e;
}

function isProduct(e: Element): e is ProductElement {
  return 'product' in e;
}

function isSequenceMediaElement(e: MediaElement): e is SequenceMediaElement {
  return 'poster' in e.resource;
}

const elementIs = {
  media: isMediaElement,
  text: isTextElement,
  defaultBackground: isDefaultBackgroundElement,
  backgroundable: isBackgroundable,
  product: isProduct,
  sequenceMedia: isSequenceMediaElement,
};

export default elementIs;
