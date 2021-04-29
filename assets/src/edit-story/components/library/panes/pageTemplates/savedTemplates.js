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
import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import TemplateSave from './templateSave';
import TemplateList from './templateList';

const Wrapper = styled.div`
  padding-top: 5px;
`;

const TemporaryWrapper = styled.div`
  overflow-y: scroll;
`;

function SavedTemplates({ pageSize, setShowDefaultTemplates }) {
  const {
    actions: { getCustomPageTemplates },
  } = useAPI();

  const [pageTemplates, setPageTemplates] = useState(null);
  const ref = useRef();

  const loadTemplates = useCallback(() => {
    getCustomPageTemplates().then(setPageTemplates);
  }, [getCustomPageTemplates]);

  const updateTemplatesList = useCallback(
    (page) => {
      setPageTemplates([page, ...pageTemplates]);
    },
    [setPageTemplates, pageTemplates]
  );

  useEffect(() => {
    if (!pageTemplates) {
      loadTemplates();
    }
  }, [loadTemplates, pageTemplates]);

  // @todo Saving template should belong to the virtual list, it's currently misplaced.
  return (
    <TemporaryWrapper>
      <TemplateSave
        pageSize={pageSize}
        setShowDefaultTemplates={setShowDefaultTemplates}
        updateList={updateTemplatesList}
      />
      <Wrapper ref={ref}>
        {pageTemplates && (
          <TemplateList
            parentRef={ref}
            pageSize={pageSize}
            pages={pageTemplates}
          />
        )}
      </Wrapper>
    </TemporaryWrapper>
  );
}

SavedTemplates.propTypes = {
  pageSize: PropTypes.object.isRequired,
  setShowDefaultTemplates: PropTypes.func.isRequired,
};

export default SavedTemplates;
