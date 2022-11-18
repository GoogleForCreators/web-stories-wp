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
import type { RefObject } from 'react';

/**
 * Internal dependencies
 */
import type keys from '../components/keyboard/keys';

export interface KeySpec {
  key: string | string[];
  shift?: boolean;
  clickable?: boolean;
  dialog?: boolean;
  repeat?: boolean;
  editable?: boolean;
  allowDefault?: boolean;
}
export type Keys = typeof keys;
export type KeyEffectCallback = (event: KeyboardEvent) => void;
export type KeyNameOrSpec = KeySpec | string | string[];

export type RefOrNode = Element | RefObject<Element>;
