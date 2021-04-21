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
import { UnitsProvider } from '../../../../units';
import useRovingTabIndex from '../../../../utils/useRovingTabIndex';
import PageTemplate from './pageTemplate';
import TemplateSave from './templateSave';
import ConfirmPageTemplateDialog from './confirmPageTemplateDialog';
import useTemplateActions from './useTemplateActions';

const Wrapper = styled.div`
  padding-left: 1em;
  padding-top: 5px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
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

  useEffect(() => {
    if (!pageTemplates) {
      loadTemplates();
    }
  }, [loadTemplates, pageTemplates]);

  const {
    isConfirming,
    handleCloseDialog,
    handleConfirmDialog,
    handleKeyboardPageClick,
    handlePageClick,
  } = useTemplateActions();

  useRovingTabIndex({ ref });

  return (
    <UnitsProvider
      pageSize={{
        width: pageSize.width,
        height: pageSize.height,
      }}
    >
      <Wrapper ref={ref}>
        <TemplateSave
          pageSize={pageSize}
          setShowDefaultTemplates={setShowDefaultTemplates}
          loadTemplates={loadTemplates}
        />
        {pageTemplates &&
          pageTemplates.map((page) => {
            return (
              <PageTemplate
                key={`${page.id}`}
                page={page}
                translateY={0}
                translateX={0}
                pageSize={pageSize}
                onClick={() => handlePageClick(page)}
                onKeyUp={(event) => handleKeyboardPageClick(event, page)}
                tabIndex="-1"
                style={{ position: 'relative' }}
              />
            );
          })}
      </Wrapper>
      {isConfirming && (
        <ConfirmPageTemplateDialog
          onConfirm={handleConfirmDialog}
          onClose={handleCloseDialog}
        />
      )}
    </UnitsProvider>
  );
}

SavedTemplates.propTypes = {
  pageSize: PropTypes.object.isRequired,
  setShowDefaultTemplates: PropTypes.func.isRequired,
};

export default SavedTemplates;
