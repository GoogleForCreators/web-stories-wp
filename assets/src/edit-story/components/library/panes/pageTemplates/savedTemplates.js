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
import { useEffect, useState, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import TemplateSave from './templateSave';
import PageTemplate from './pageTemplate';

const Wrapper = styled.div`
  margin-left: 1em;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
  overflow-y: scroll;
`;

const TemplateWrapper = styled.div`
  position: relative;
  height: ${({ pageSize }) => pageSize.containerHeight}px;
  width: ${({ pageSize }) => pageSize.width}px;
`;

function SavedTemplates({ pageSize, setShowDefaultTemplates }) {
  const {
    actions: { getCustomPageTemplates },
  } = useAPI();
  const [pageTemplates, setPageTemplates] = useState(null);

  const loadTemplates = useCallback(() => {
    getCustomPageTemplates().then(setPageTemplates);
  }, [getCustomPageTemplates]);

  useEffect(() => {
    if (!pageTemplates) {
      loadTemplates();
    }
  }, [loadTemplates, pageTemplates]);

  return (
    <Wrapper>
      <TemplateWrapper pageSize={pageSize}>
        <TemplateSave
          pageSize={pageSize}
          setShowDefaultTemplates={setShowDefaultTemplates}
          loadTemplates={loadTemplates}
        />
      </TemplateWrapper>
      {pageTemplates &&
        pageTemplates.map((page) => {
          return (
            <TemplateWrapper key={page.id} pageSize={pageSize}>
              <PageTemplate
                page={page}
                translateY={0}
                translateX={0}
                pageSize={pageSize}
              />
            </TemplateWrapper>
          );
        })}
    </Wrapper>
  );
}

SavedTemplates.propTypes = {
  pageSize: PropTypes.object.isRequired,
  setShowDefaultTemplates: PropTypes.func.isRequired,
};

export default SavedTemplates;
