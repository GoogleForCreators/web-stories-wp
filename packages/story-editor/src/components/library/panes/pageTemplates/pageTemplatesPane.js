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
import {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from '@googleforcreators/react';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import { FULLBLEED_RATIO, PAGE_RATIO } from '@googleforcreators/units';
import {
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@googleforcreators/design-system';
import { DATA_VERSION, migrate } from '@googleforcreators/migration';
import { trackError } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import { Pane } from '../shared';
import { Select } from '../../../form';
import { useAPI } from '../../../../app/api';
import useLibrary from '../../useLibrary';
import { useConfig } from '../../../../app/config';
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
  margin: 28px 16px 17px;
`;

const ButtonWrapper = styled.div`
  padding: 0 1em;
  margin-top: 24px;
`;

const DEFAULT = 'default';
const SAVED = 'saved';
const PAGE_TEMPLATE_PANE_WIDTH = 158;
const LOCAL_STORAGE_KEY =
  LOCAL_STORAGE_PREFIX.DEFAULT_VIEW_PAGE_TEMPLATE_LAYOUT;
const DEFAULT_TEMPLATE_VIEW = localStore.getItemByKey(LOCAL_STORAGE_KEY);

function PageTemplatesPane(props) {
  const {
    actions: { getCustomPageTemplates },
  } = useAPI();

  const { canViewDefaultTemplates } = useConfig();
  const supportsCustomTemplates = Boolean(getCustomPageTemplates);

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

  const [showDefaultTemplates, setShowDefaultTemplates] = useState(
    DEFAULT_TEMPLATE_VIEW === null
      ? canViewDefaultTemplates
      : canViewDefaultTemplates && DEFAULT_TEMPLATE_VIEW
  );

  const [highlightedTemplate, setHighlightedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateTemplatesList = useCallback(
    (page) => {
      setSavedTemplates((_savedTemplates) => {
        return [page, ...(_savedTemplates || [])];
      });
      setHighlightedTemplate(page.id);
      localStore.setItemByKey(LOCAL_STORAGE_KEY, false);
    },
    [setSavedTemplates]
  );

  const loadTemplates = useCallback(() => {
    // if nextTemplatesToFetch is false, we must not perform an API call
    // with page=false.
    if (!nextTemplatesToFetch) {
      return;
    }

    setIsLoading(true);
    getCustomPageTemplates(nextTemplatesToFetch)
      .then(({ templates, hasMore }) => {
        const updatedTemplates = templates.map(
          ({ version, templateId, ...page }) => {
            const template = {
              pages: [page],
            };

            // Older page templates unfortunately don't have a version.
            // This is just a reasonable fallback, as 25 was the data version
            // when custom page templates were first introduced.
            const migratedTemplate = migrate(template, version || 25);
            return {
              templateId,
              version: DATA_VERSION,
              ...migratedTemplate.pages[0],
            };
          }
        );
        setSavedTemplates((_savedTemplates) => [
          ...(_savedTemplates || []),
          ...updatedTemplates,
        ]);

        if (!hasMore) {
          setNextTemplatesToFetch(false);
        } else {
          setNextTemplatesToFetch(nextTemplatesToFetch + 1);
        }
      })
      .catch((err) => {
        trackError('saved_templates', err.message);
        setNextTemplatesToFetch(false);
        setSavedTemplates((_savedTemplates) => _savedTemplates ?? []);
      })
      .finally(() => setIsLoading(false));
  }, [
    getCustomPageTemplates,
    nextTemplatesToFetch,
    setSavedTemplates,
    setNextTemplatesToFetch,
  ]);

  const handleSelect = (_, menuItem) => {
    const value = menuItem === DEFAULT;
    const shouldSetShowDefaultTemplates = showDefaultTemplates !== value;

    if (shouldSetShowDefaultTemplates) {
      setShowDefaultTemplates(DEFAULT === menuItem);
      localStore.setItemByKey(LOCAL_STORAGE_KEY, value);
    }
  };

  useEffect(() => {
    if (!savedTemplates && !showDefaultTemplates) {
      loadTemplates();
    }
  }, [savedTemplates, loadTemplates, showDefaultTemplates]);

  useEffect(() => {
    let timeout = null;
    if (highlightedTemplate) {
      timeout = setTimeout(() => {
        setHighlightedTemplate(null);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [highlightedTemplate]);

  const options = [];

  if (canViewDefaultTemplates) {
    options.push({
      value: DEFAULT,
      label: __('Default templates', 'web-stories'),
    });
  }

  if (supportsCustomTemplates) {
    options.push({
      value: SAVED,
      label: __('Saved templates', 'web-stories'),
    });
  }

  const pageSize = useMemo(() => {
    const width = PAGE_TEMPLATE_PANE_WIDTH;
    const height = Math.round(width / PAGE_RATIO);
    const containerHeight = Math.round(width / FULLBLEED_RATIO);
    return { width, height, containerHeight };
  }, []);

  return (
    <StyledPane id={paneId} {...props}>
      <PaneInner>
        <>
          {supportsCustomTemplates && (
            <ButtonWrapper>
              <TemplateSave
                setShowDefaultTemplates={setShowDefaultTemplates}
                updateList={updateTemplatesList}
              />
            </ButtonWrapper>
          )}
          <DropDownWrapper>
            {options.length > 1 && (
              <Select
                options={options}
                selectedValue={showDefaultTemplates ? DEFAULT : SAVED}
                onMenuItemClick={handleSelect}
                aria-label={__('Select templates type', 'web-stories')}
              />
            )}
          </DropDownWrapper>
        </>
        {showDefaultTemplates ? (
          <DefaultTemplates pageSize={pageSize} />
        ) : (
          <SavedTemplates
            pageSize={pageSize}
            highlightedTemplate={highlightedTemplate}
            loadTemplates={loadTemplates}
            isLoading={isLoading}
          />
        )}
      </PaneInner>
    </StyledPane>
  );
}

export default PageTemplatesPane;
