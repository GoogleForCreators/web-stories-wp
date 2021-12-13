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
// import { useCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import { Modal } from '@web-stories-wp/design-system';
import PropTypes from 'prop-types';
// import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../config';
import { TemplatePropType, TemplateActionsPropType } from '../../../../types';
import Header from './templateDetails/header';
import DetailsContent from './templateDetails/content';

function TemplateDetailsModal({
  activeTemplateIndex,
  activeTemplate,
  filteredTemplatesLength,
  isDetailsViewOpen,
  templateActions,
}) {
  const { isRTL, apiCallbacks } = useConfig();
  const canCreateStory = Boolean(apiCallbacks?.createStoryFromTemplate);

  const { handleDetailsToggle, switchToTemplateByOffset } =
    templateActions || {};

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
    >
      <Header
        templateTitle={activeTemplate?.title}
        templateId={activeTemplate?.id}
        templateActions={templateActions}
        canCreateStory={canCreateStory}
      />
      <DetailsContent
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
  // handleDetailsToggle: PropTypes.func,
  isDetailsViewOpen: PropTypes.bool,
  templateActions: TemplateActionsPropType,
  // switchToTemplateByOffset: PropTypes.func,
  // createStoryFromTemplate: PropTypes.func,
};
export default TemplateDetailsModal;
