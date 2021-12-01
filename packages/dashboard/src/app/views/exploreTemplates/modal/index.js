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
import { __ } from '@web-stories-wp/i18n';
import { Modal } from '@web-stories-wp/design-system';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../config';
import {
  PageSizePropType,
  TemplatesPropType,
  TemplatePropType,
  TemplateActionsPropType,
} from '../../../../types';
import DetailsGallery from '../../templateDetails/content/detailsGallery';
import RelatedGrid from '../../templateDetails/content/relatedGrid';

function TemplateDetailsModal({
  activeTemplateIndex,
  activeTemplate,
  filteredTemplates,
  handleDetailsToggle,
  isDetailsViewOpen,
  pageSize,
  relatedTemplates,
  switchToTemplateByOffset,
  templateActions,
}) {
  const { isRTL } = useConfig();

  return (
    <Modal
      isOpen={isDetailsViewOpen}
      onClose={handleDetailsToggle}
      contentLabel={__('Details View', 'web-stories')}
      overlayStyles={{
        alignItems: 'stretch',
        backgroundColor: '#fff', // theme.colors.brand.gray[90]
      }}
      contentStyles={{
        flex: 1,
      }}
      modalStyles={{ maxHeight: '70vh' }}
    >
      <DetailsGallery
        activeTemplateIndex={activeTemplateIndex}
        isRTL={isRTL}
        filteredTemplatesLength={filteredTemplates.length}
        switchToTemplateByOffset={switchToTemplateByOffset}
        template={activeTemplate}
      />
      <RelatedGrid
        pageSize={pageSize}
        relatedTemplates={relatedTemplates}
        templateActions={templateActions}
      />
    </Modal>
  );
}
TemplateDetailsModal.propTypes = {
  activeTemplateIndex: PropTypes.number,
  activeTemplate: TemplatePropType,
  filteredTemplates: TemplatesPropType,
  handleDetailsToggle: PropTypes.func,
  isDetailsViewOpen: PropTypes.bool,
  pageSize: PageSizePropType,
  relatedTemplates: TemplatesPropType,
  switchToTemplateByOffset: PropTypes.func,
  templateActions: TemplateActionsPropType,
};
export default TemplateDetailsModal;
