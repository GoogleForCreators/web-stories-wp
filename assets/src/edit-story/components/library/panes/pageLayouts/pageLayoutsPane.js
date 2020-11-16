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
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useAPI } from '../../../../app/api';
import { Pane } from '../shared';
import PillGroup from '../shared/pillGroup';
import paneId from './paneId';
import PageLayouts from './pageLayouts';

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

function PageLayoutsPane(props) {
  const {
    actions: { getTemplates },
  } = useAPI();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const paneRef = useRef();

  useEffect(() => {
    getTemplates().then((result) => setTemplates(result));
  }, [getTemplates]);

  const pills = useMemo(
    () =>
      templates.map((template) => ({
        id: template.id,
        label: template.title,
      })),
    [templates]
  );

  const filteredPages = useMemo(() => {
    if (selectedTemplateId) {
      const template = templates.find(
        (template) => template.id === selectedTemplateId
      );
      if (template) {
        return template.pages;
      }
    }
    return templates.reduce(
      (pages, template) => [...pages, ...template.pages],
      []
    );
  }, [templates, selectedTemplateId]);

  const handleSelectTemplate = useCallback((templateId) => {
    setSelectedTemplateId(templateId);
  }, []);

  return (
    <StyledPane id={paneId} {...props} ref={paneRef}>
      <PaneInner>
        <PillGroup
          items={pills}
          selectedItemId={selectedTemplateId}
          selectItem={handleSelectTemplate}
          deselectItem={() => handleSelectTemplate(null)}
        />
        {paneRef.current && (
          <PageLayouts paneRef={paneRef} pages={filteredPages} />
        )}
      </PaneInner>
    </StyledPane>
  );
}

export default PageLayoutsPane;
