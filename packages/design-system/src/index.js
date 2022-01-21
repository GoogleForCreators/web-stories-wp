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
import Modal from 'react-modal';

/**
 * Internal dependencies
 */
import localStore, { LOCAL_STORAGE_PREFIX } from './utils/localStore';
import * as Icons from './icons';
import * as SVGIcons from './icons/svg';

const { setAppElement } = Modal;

export { Icons, SVGIcons };
export { localStore, LOCAL_STORAGE_PREFIX };
export * from './components';
export * from './contexts';
export * from './images';
export * from './theme';
export * from './utils';
export { setAppElement };
