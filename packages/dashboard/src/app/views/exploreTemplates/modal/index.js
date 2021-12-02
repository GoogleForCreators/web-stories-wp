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
import { useCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import { Modal } from '@web-stories-wp/design-system';
import PropTypes from 'prop-types';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../config';
import { TemplatePropType } from '../../../../types';
import DetailsGallery from '../../templateDetails/content/detailsGallery';
import Header from '../../templateDetails/header';

function TemplateDetailsModal({
  activeTemplateIndex,
  activeTemplate,
  filteredTemplatesLength,
  handleDetailsToggle,
  isDetailsViewOpen,
  switchToTemplateByOffset,
  createStoryFromTemplate,
}) {
  const { isRTL } = useConfig();
  const { apiCallbacks } = useConfig();

  const handleCreateStoryFromTemplate = useCallback(() => {
    if (activeTemplate) {
      trackEvent('use_template', {
        name: activeTemplate.title,
        template_id: activeTemplate?.id,
      });
      createStoryFromTemplate(activeTemplate);
    }
  }, [createStoryFromTemplate, activeTemplate]);

  const canCreateStory = Boolean(apiCallbacks?.createStoryFromTemplate);

  return (
    <Modal
      isOpen={isDetailsViewOpen}
      onClose={handleDetailsToggle}
      contentLabel={__('Details View', 'web-stories')}
      overlayStyles={{
        backgroundColor: '#00000047',
      }}
      contentStyles={{
        display: 'block',
        height: '80vh',
        width: '80vw',
        backgroundColor: '#fff',
      }}
      modalStyles={{ height: '80vh' }}
    >
      <Header
        handleDetailsToggle={handleDetailsToggle}
        templateTitle={activeTemplate?.title}
        onHandleCtaClick={canCreateStory ? handleCreateStoryFromTemplate : null}
      />
      <DetailsGallery
        activeTemplateIndex={activeTemplateIndex}
        isRTL={isRTL}
        filteredTemplatesLength={filteredTemplatesLength}
        switchToTemplateByOffset={switchToTemplateByOffset}
        template={activeTemplate}
      />
    </Modal>
  );
}
TemplateDetailsModal.propTypes = {
  activeTemplateIndex: PropTypes.number,
  activeTemplate: TemplatePropType,
  filteredTemplatesLength: PropTypes.number,
  handleDetailsToggle: PropTypes.func,
  isDetailsViewOpen: PropTypes.bool,
  switchToTemplateByOffset: PropTypes.func,
  createStoryFromTemplate: PropTypes.func,
};
export default TemplateDetailsModal;
