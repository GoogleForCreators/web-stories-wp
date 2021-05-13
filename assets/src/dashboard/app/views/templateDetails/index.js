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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@web-stories-wp/tracking';
/**
 * Internal dependencies
 */
import { clamp } from '../../../../animation';
import { TransformProvider } from '../../../../edit-story/components/transform';
import { Layout } from '../../../components';
import { usePagePreviewSize } from '../../../utils';
import useApi from '../../api/useApi';
import { useConfig } from '../../config';
import FontProvider from '../../font/fontProvider';
import { useSnackbar } from '../../../../design-system';
import { resolveRelatedTemplateRoute } from '../../router';
import useRouteHistory from '../../router/useRouteHistory';
import { ERRORS } from '../../textContent';
import Header from './header';
import Content from './content';

function TemplateDetails() {
  const [template, setTemplate] = useState(null);
  const [relatedTemplates, setRelatedTemplates] = useState([]);

  const {
    state: {
      queryParams: { id: templateId, isLocal },
    },
    actions,
  } = useRouteHistory();

  const { showSnackbar } = useSnackbar();

  const {
    isLoading,
    templates,
    templatesOrderById,
    createStoryFromTemplate,
    fetchMyTemplateById,
    fetchExternalTemplates,
    fetchExternalTemplateById,
    fetchRelatedTemplates,
  } = useApi(
    ({
      state: {
        templates: { templates, templatesOrderById, totalPages, isLoading },
      },
      actions: {
        storyApi: { createStoryFromTemplate },
        templateApi: {
          fetchExternalTemplates,
          fetchMyTemplateById,
          fetchExternalTemplateById,
          fetchRelatedTemplates,
        },
      },
    }) => ({
      isLoading,
      templates,
      templatesOrderById,
      totalPages,
      createStoryFromTemplate,
      fetchExternalTemplates,
      fetchMyTemplateById,
      fetchExternalTemplateById,
      fetchRelatedTemplates,
    })
  );
  const { isRTL } = useConfig();
  const { pageSize } = usePagePreviewSize({ isGrid: true });

  useEffect(() => {
    if (!templateId) {
      return;
    }

    if ((!templates || Object.values(templates).length === 0) && !isLoading) {
      fetchExternalTemplates();
      return;
    }

    if (isLoading) {
      return;
    }

    const id = parseInt(templateId);
    const isLocalTemplate = isLocal && isLocal.toLowerCase() === 'true';
    const templateFetchFn = isLocalTemplate
      ? fetchMyTemplateById
      : fetchExternalTemplateById;

    templateFetchFn(id)
      .then(setTemplate)
      .catch(() => {
        showSnackbar({
          message: ERRORS.LOAD_TEMPLATES.DEFAULT_MESSAGE,
          dismissable: true,
        });
      });
  }, [
    isLoading,
    fetchExternalTemplates,
    fetchExternalTemplateById,
    fetchMyTemplateById,
    isLocal,
    templateId,
    templates,
    showSnackbar,
  ]);

  const templatedId = template?.id;

  useEffect(() => {
    if (!template || !templateId) {
      return;
    }
    const id = parseInt(templateId);

    setRelatedTemplates(
      fetchRelatedTemplates(id).map((relatedTemplate) => ({
        ...relatedTemplate,
        centerTargetAction: resolveRelatedTemplateRoute(relatedTemplate),
      }))
    );
  }, [
    fetchRelatedTemplates,
    template,
    templates,
    templatesOrderById,
    templateId,
  ]);

  const activeTemplateIndex = useMemo(() => {
    if (templatesOrderById.length <= 0) {
      return 0;
    }

    return templatesOrderById.findIndex((id) => id === templatedId);
  }, [templatesOrderById, templatedId]);

  const switchToTemplateByOffset = useCallback(
    (offset) => {
      const index = clamp(activeTemplateIndex + offset, [
        0,
        templatesOrderById.length - 1,
      ]);
      const selectedTemplateId = templatesOrderById[index];
      const selectedTemplate = templates[selectedTemplateId];

      actions.push(
        `?id=${selectedTemplate.id}&isLocal=${selectedTemplate.isLocal}`
      );
    },
    [activeTemplateIndex, templatesOrderById, actions, templates]
  );

  const onHandleCta = useCallback(() => {
    trackEvent('use_template', {
      name: template.title,
      template_id: template.id,
    });
    createStoryFromTemplate(template);
  }, [createStoryFromTemplate, template]);

  return (
    <FontProvider>
      <TransformProvider>
        <Layout.Provider>
          <Header
            templateTitle={template?.title}
            onHandleCtaClick={onHandleCta}
          />
          <Content
            activeTemplateIndex={activeTemplateIndex}
            isRTL={isRTL}
            orderedTemplatesLength={templatesOrderById.length}
            pageSize={pageSize}
            switchToTemplateByOffset={switchToTemplateByOffset}
            template={template}
            relatedTemplates={relatedTemplates}
            templateActions={{
              createStoryFromTemplate,
            }}
          />
        </Layout.Provider>
      </TransformProvider>
    </FontProvider>
  );
}

export default TemplateDetails;
