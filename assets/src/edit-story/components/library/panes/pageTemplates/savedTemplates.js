/*
 * Copyright 2021 Google LLC
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
import styled from 'styled-components';
import { useEffect, useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import TemplateList from './templateList';

const Wrapper = styled.div`
  padding-top: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

function SavedTemplates({ pageSize, pageTemplates, setPageTemplates }) {
  const {
    actions: { getCustomPageTemplates },
  } = useAPI();

  const ref = useRef();

  const loadTemplates = useCallback(() => {
    getCustomPageTemplates().then(setPageTemplates);
  }, [getCustomPageTemplates, setPageTemplates]);

  useEffect(() => {
    if (!pageTemplates) {
      loadTemplates();
    }
  }, [loadTemplates, pageTemplates]);

  return (
    <Wrapper ref={ref}>
      {pageTemplates && (
        <TemplateList
          parentRef={ref}
          pageSize={pageSize}
          pages={pageTemplates}
        />
      )}
    </Wrapper>
  );
}

SavedTemplates.propTypes = {
  pageSize: PropTypes.object.isRequired,
  setPageTemplates: PropTypes.func.isRequired,
  pageTemplates: PropTypes.oneOfType([null, PropTypes.array.isRequired]),
};

export default SavedTemplates;
