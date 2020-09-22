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
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import {
  TemplateActionsPropType,
  TemplatesPropType,
  PageSizePropType,
  TemplatePropType,
} from '../../../../types';
import {
  DetailViewContentGutter,
  Layout,
  useLayoutContext,
} from '../../../../components';
import DetailsGallery from './detailsGallery';
import RelatedGrid from './relatedGrid';

function Content({
  activeTemplateIndex,
  isRTL,
  orderedTemplatesLength,
  pageSize,
  relatedTemplates,
  switchToTemplateByOffset,
  template,
  templateActions,
}) {
  const previousTemplateId = useRef(template?.id);

  const {
    actions: { scrollToTop },
  } = useLayoutContext();

  useEffect(() => {
    if (template !== null && template?.id !== previousTemplateId.current) {
      scrollToTop();
      previousTemplateId.current = template.id;
    }
  }, [template, scrollToTop]);

  if (!template) {
    return null;
  }

  return (
    <Layout.Scrollable>
      <DetailViewContentGutter>
        <DetailsGallery
          activeTemplateIndex={activeTemplateIndex}
          isRTL={isRTL}
          orderedTemplatesLength={orderedTemplatesLength}
          switchToTemplateByOffset={switchToTemplateByOffset}
          template={template}
        />
        <RelatedGrid
          relatedTemplates={relatedTemplates}
          pageSize={pageSize}
          templateActions={templateActions}
        />
      </DetailViewContentGutter>
    </Layout.Scrollable>
  );
}

Content.propTypes = {
  activeTemplateIndex: PropTypes.number,
  isRTL: PropTypes.bool,
  orderedTemplatesLength: PropTypes.number,
  pageSize: PageSizePropType,
  relatedTemplates: TemplatesPropType,
  switchToTemplateByOffset: PropTypes.func,
  template: TemplatePropType,
  templateActions: TemplateActionsPropType,
};

export default Content;
