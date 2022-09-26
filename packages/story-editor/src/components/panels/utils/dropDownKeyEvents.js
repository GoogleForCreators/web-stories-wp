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
import PropTypes from 'prop-types';
import { useKeyDownEffect } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import useFocusCanvas from '../../canvas/useFocusCanvas';
import useRovingTabIndex from '../../../utils/useRovingTabIndex';

// This is used for nested roving tab index to detect parent siblings.
const BUTTON_NESTING_DEPTH = 3;

export default function DropDownKeyEvents({ target }) {
  useRovingTabIndex({ ref: target }, [], BUTTON_NESTING_DEPTH);
  const focusCanvas = useFocusCanvas();
  useKeyDownEffect(target, 'tab', focusCanvas, [focusCanvas]);
  return null;
}

DropDownKeyEvents.propTypes = {
  target: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};
