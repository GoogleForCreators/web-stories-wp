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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */

import { PillLabel, ActiveChoiceIcon } from './components';

export default function DefaultPill({ children, isSelected = false }) {
  return (
    <PillLabel isSelected={isSelected} data-testid="default-pill-label">
      {children}
      {isSelected && <ActiveChoiceIcon />}
    </PillLabel>
  );
}

DefaultPill.propTypes = {
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool,
};
