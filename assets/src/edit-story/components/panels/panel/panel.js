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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useState, useCallback, useEffect } from 'react';

/**
 * Internal dependencies
 */
import panelContext from './context';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

function Panel({ initialHeight, name, children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [height, setHeight] = useState(initialHeight);
  const [manuallyChanged, setManuallyChanged] = useState(false);

  const collapse = useCallback(() => setIsCollapsed(true), []);
  const expand = useCallback(() => {
    setIsCollapsed(false);
    setHeight(initialHeight);
  }, [initialHeight]);

  useEffect(() => {
    if (height === 0 && isCollapsed === false) {
      collapse();
    }
  }, [collapse, height, isCollapsed]);

  useEffect(() => {
    if (manuallyChanged) {
      return;
    }
    setHeight(initialHeight);
  }, [manuallyChanged, initialHeight]);

  const manuallySetHeight = useCallback(
    (h) => {
      setManuallyChanged(true);
      setHeight(h);
    },
    [setManuallyChanged, setHeight]
  );

  const resetHeight = useCallback(() => {
    setManuallyChanged(false);
  }, []);

  const panelContentId = `panel-${name}-${uuidv4()}`;

  const contextValue = {
    state: {
      height,
      isCollapsed,
      panelContentId,
    },
    actions: {
      setHeight: manuallySetHeight,
      collapse,
      expand,
      resetHeight,
    },
  };

  const ContextProvider = panelContext.Provider;

  return (
    <Wrapper>
      <ContextProvider value={contextValue}>{children}</ContextProvider>
    </Wrapper>
  );
}

Panel.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  name: PropTypes.string.isRequired,
  initialHeight: PropTypes.number,
};

Panel.defaultProps = {
  initialHeight: null,
};

export default Panel;
