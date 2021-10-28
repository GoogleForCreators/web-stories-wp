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
 * Internal dependencies
 */
import Dashboard from './dashboard';

export * from './app';
export * from './app/router';
export * from './constants';
export * from './components';
export * from './app/views/shared';
export { GlobalStyle as DashboardGlobalStyle } from './theme';
export { default as DashboardKeyboardOnlyOutline } from './utils/keyboardOnlyOutline';
export { default as InterfaceSkeleton } from './components/interfaceSkeleton';

export default Dashboard;
