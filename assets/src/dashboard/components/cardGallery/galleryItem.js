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
import React, { useState } from 'react';
import { MiniCardWrapper } from './components';

function GalleryItem({ children, isActive, gridRef, ...rest }) {
  console.log('isactive? ', isActive);
  const [tabIndex, setTabIndex] = useState(isActive ? 0 : -1);

  const onBlur = (e) => {
    console.log('blur captured ', e.relatedTarget, gridRef);
    if (gridRef?.current?.contains(e.relatedTarget)) {
      console.log('????');
      setTabIndex(-1);
    }
  };

  const onFocus = () => {
    console.log('FOCUS!! ');
    setTabIndex(0);
  };

  return (
    <MiniCardWrapper
      tabIndex={tabIndex}
      onBlur={onBlur}
      onFocus={onFocus}
      {...rest}
    >
      {children}
    </MiniCardWrapper>
  );
}

export default GalleryItem;

GalleryItem.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  gridRef: PropTypes.object,
};
