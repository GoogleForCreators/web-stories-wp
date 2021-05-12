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
import { useState, useCallback, useRef, useLayoutEffect } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import {
  Text,
  THEME_CONSTANTS,
  useSnackbar,
} from '../../../../../design-system';
import Dialog from '../../../dialog';
import useLibrary from '../../useLibrary';
import TemplateList from './templateList';

const Wrapper = styled.div`
  padding-top: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

function SavedTemplates({ pageSize, ...rest }) {
  const {
    actions: { deletePageTemplate, getCustomPageTemplates },
  } = useAPI();

  const {
    savedTemplates,
    setSavedTemplates,
    nextTemplatesToFetch,
    setNextTemplatesToFetch,
  } = useLibrary((state) => ({
    savedTemplates: state.state.savedTemplates,
    nextTemplatesToFetch: state.state.nextTemplatesToFetch,
    setSavedTemplates: state.actions.setSavedTemplates,
    setNextTemplatesToFetch: state.actions.setNextTemplatesToFetch,
  }));

  const { showSnackbar } = useSnackbar();

  const [showDialog, setShowDialog] = useState(null);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const ref = useRef();

  // This is a workaround to force re-rendering for the virtual list to work and the parentRef being assigned correctly.
  // @todo Look into why does the ref not work as expected otherwise.
  useLayoutEffect(() => {
    setShowDialog(false);
  }, []);

  const fetchTemplates = useCallback(() => {
    if (!nextTemplatesToFetch) {
      return;
    }
    getCustomPageTemplates(nextTemplatesToFetch)
      .then(({ templates, hasMore }) => {
        setSavedTemplates([...savedTemplates, ...templates]);
        if (!hasMore) {
          setNextTemplatesToFetch(false);
        } else {
          setNextTemplatesToFetch(nextTemplatesToFetch + 1);
        }
      })
      .catch(() => setNextTemplatesToFetch(false));
  }, [
    nextTemplatesToFetch,
    setNextTemplatesToFetch,
    getCustomPageTemplates,
    savedTemplates,
    setSavedTemplates,
  ]);

  const onClickDelete = useCallback(({ templateId }, e) => {
    e?.stopPropagation();
    if (templateId) {
      setShowDialog(true);
      setTemplateToDelete(templateId);
    }
  }, []);

  const handleDelete = useCallback(
    () =>
      deletePageTemplate(templateToDelete)
        .then(() => {
          setSavedTemplates(
            savedTemplates.filter(
              ({ templateId }) => templateId !== templateToDelete
            )
          );
          setShowDialog(false);
        })
        .catch(() => {
          showSnackbar({
            message: __(
              'Unable to delete the template. Please try again.',
              'web-stories'
            ),
            dismissable: true,
          });
        }),
    [
      deletePageTemplate,
      templateToDelete,
      savedTemplates,
      showSnackbar,
      setSavedTemplates,
    ]
  );

  return (
    <Wrapper ref={ref}>
      {ref.current && (
        <TemplateList
          parentRef={ref}
          pageSize={pageSize}
          pages={savedTemplates}
          handleDelete={onClickDelete}
          fetchTemplates={fetchTemplates}
          {...rest}
        />
      )}
      {showDialog && (
        <Dialog
          isOpen
          onClose={() => setShowDialog(false)}
          title={__('Delete Page Template', 'web-stories')}
          secondaryText={__('Cancel', 'web-stories')}
          onPrimary={handleDelete}
          primaryText={__('Delete', 'web-stories')}
        >
          <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__(
              'Are you sure you want to delete this template? This action cannot be undone.',
              'web-stories'
            )}
          </Text>
        </Dialog>
      )}
    </Wrapper>
  );
}

SavedTemplates.propTypes = {
  pageSize: PropTypes.object.isRequired,
};

export default SavedTemplates;
