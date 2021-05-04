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
import { useState, useMemo, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useFeatures } from 'flagged';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Pane } from '../shared';
import { Select } from '../../../form';
import { FULLBLEED_RATIO, PAGE_RATIO } from '../../../../constants';
import { useAPI } from '../../../../app/api';
import useLibrary from '../../useLibrary';
import paneId from './paneId';
import DefaultTemplates from './defaultTemplates';
import SavedTemplates from './savedTemplates';
import TemplateSave from './templateSave';

export const StyledPane = styled(Pane)`
  height: 100%;
  padding: 0;
  overflow: hidden;
`;

export const PaneInner = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const DropDownWrapper = styled.div`
  text-align: left;
  height: 36px;
  margin: 28px 16px 17px;
`;

const DEFAULT = 'default';
const SAVED = 'saved';
const PAGE_TEMPLATE_PANE_WIDTH = 158;

const ButtonWrapper = styled.div`
  padding: 0 1em;
  margin-top: 24px;
`;

function PageTemplatesPane(props) {
  const { customPageTemplates } = useFeatures();
  const {
    actions: { getCustomPageTemplates },
  } = useAPI();

  const { savedTemplates, setSavedTemplates } = useLibrary((state) => ({
    savedTemplates: state.state.savedTemplates,
    setSavedTemplates: state.actions.setSavedTemplates,
  }));

  const [showDefaultTemplates, setShowDefaultTemplates] = useState(true);
  const [highlightedTemplate, setHighlightedTemplate] = useState(null);

  const updateTemplatesList = useCallback(
    (page) => {
      setSavedTemplates([page, ...savedTemplates]);
      setHighlightedTemplate(page.id);
    },
    [setSavedTemplates, savedTemplates]
  );

  const loadTemplates = useCallback(() => {
    getCustomPageTemplates().then(setSavedTemplates);
  }, [getCustomPageTemplates, setSavedTemplates]);

  useEffect(() => {
    if (!savedTemplates && customPageTemplates) {
      loadTemplates();
    }
  }, [savedTemplates, loadTemplates, customPageTemplates]);

  useEffect(() => {
    let timeout = null;
    if (highlightedTemplate) {
      timeout = setTimeout(() => {
        setHighlightedTemplate(null);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [highlightedTemplate]);

  const options = [
    {
      value: DEFAULT,
      label: __('Default templates', 'web-stories'),
    },
    {
      value: SAVED,
      label: __('Saved templates', 'web-stories'),
    },
  ];

  const pageSize = useMemo(() => {
    const width = PAGE_TEMPLATE_PANE_WIDTH;
    const height = Math.round(width / PAGE_RATIO);
    const containerHeight = Math.round(width / FULLBLEED_RATIO);
    return { width, height, containerHeight };
  }, []);

  return (
    <StyledPane id={paneId} {...props}>
      <PaneInner>
        {customPageTemplates && (
          <>
            {savedTemplates && (
              <ButtonWrapper>
                <TemplateSave
                  setShowDefaultTemplates={setShowDefaultTemplates}
                  updateList={updateTemplatesList}
                />
              </ButtonWrapper>
            )}
            <DropDownWrapper>
              <Select
                options={options}
                selectedValue={showDefaultTemplates ? DEFAULT : SAVED}
                onMenuItemClick={(evt, value) =>
                  setShowDefaultTemplates(value === DEFAULT)
                }
                aria-label={__('Select templates type', 'web-stories')}
              />
            </DropDownWrapper>
          </>
        )}
        {showDefaultTemplates ? (
          <DefaultTemplates pageSize={pageSize} />
        ) : (
          <SavedTemplates
            savedTemplates={savedTemplates}
            setSavedTemplates={setSavedTemplates}
            pageSize={pageSize}
            highlightedTemplate={highlightedTemplate}
          />
        )}
      </PaneInner>
    </StyledPane>
  );
}

export default PageTemplatesPane;
