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
import { LoadingSpinner, useSnackbar } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import useLibrary from '../../useLibrary';
import { LoadingContainer } from '../shared';
import TemplateList from './templateList';

const Wrapper = styled.div`
  height: 100%;
  padding-top: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
  min-height: 96px;
`;

function SavedTemplates({
  searchTerm,
  setSearchTerm,
  pageSize,
  loadTemplates,
  isLoading,
  ...rest
}) {
  "use no memo"

  const {
    actions: { deletePageTemplate },
  } = useAPI();

  const { savedTemplates, setSavedTemplates, nextTemplatesToFetch } =
    useLibrary((state) => ({
      savedTemplates: state.state.savedTemplates,
      nextTemplatesToFetch: state.state.nextTemplatesToFetch,
      setSavedTemplates: state.actions.setSavedTemplates,
    }));

  const { showSnackbar } = useSnackbar();
  const ref = useRef();

  // This is a workaround to force re-rendering for the virtual list to work and the parentRef being assigned correctly.
  // @todo Look into why does the ref not work as expected otherwise.
  const [, update] = useState(null);
  useLayoutEffect(() => {
    update(false);
  }, []);

  const fetchTemplates = useCallback(() => {
    if (!nextTemplatesToFetch) {
      return;
    }

    loadTemplates();
  }, [nextTemplatesToFetch, loadTemplates]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await deletePageTemplate(id);
        setSavedTemplates(
          savedTemplates.filter(({ templateId }) => templateId !== id)
        );
        showSnackbar({
          message: __('Page Template deleted.', 'web-stories'),
          dismissable: true,
        });
      } catch {
        showSnackbar({
          message: __(
            'Unable to delete the template. Please try again.',
            'web-stories'
          ),
          dismissible: true,
        });
      }
    },
    [deletePageTemplate, savedTemplates, showSnackbar, setSavedTemplates]
  );

  return (
    // tabIndex is required for FireFox bug when using keyboard to navigate from Saved / Default Templates dropdown to Template
    <Wrapper ref={ref} tabIndex={-1}>
      {!isLoading && ref.current ? (
        <TemplateList
          parentRef={ref}
          pageSize={pageSize}
          pages={savedTemplates}
          handleDelete={handleDelete}
          fetchTemplates={fetchTemplates}
          {...rest}
        />
      ) : (
        <LoadingContainer>
          <LoadingSpinner animationSize={64} numCircles={8} />
        </LoadingContainer>
      )}
    </Wrapper>
  );
}

SavedTemplates.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  pageSize: PropTypes.object.isRequired,
  loadTemplates: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default SavedTemplates;
