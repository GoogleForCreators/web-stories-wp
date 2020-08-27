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
import { useState, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { MiniCardButton } from './components';

function FocusableGalleryItem({ children, isActive, gridRef, ...rest }) {
  const [tabIndex, setTabIndex] = useState(isActive ? 0 : -1);

  const onBlur = useCallback(
    (e) => {
      if (gridRef?.current?.contains(e.relatedTarget)) {
        setTabIndex(-1);
      }
    },
    [gridRef]
  );

  const onFocus = () => setTabIndex(0);

  return (
    <MiniCardButton
      tabIndex={tabIndex}
      onBlur={onBlur}
      onFocus={onFocus}
      {...rest}
    >
      {children}
    </MiniCardButton>
  );
}

export default FocusableGalleryItem;

FocusableGalleryItem.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  gridRef: PropTypes.object,
};
