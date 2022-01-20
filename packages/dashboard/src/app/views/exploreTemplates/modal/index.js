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
import { __ } from '@googleforcreators/i18n';
import { Modal, theme } from '@googleforcreators/design-system';
import PropTypes from 'prop-types';

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
        backgroundColor: `${theme.colors.opacity.overlayDark}`,
      }}
      contentStyles={{
        display: 'block',
        height: '80vh',
        width: '80vw',
        backgroundColor: `${theme.colors.standard.white}`,
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
  isDetailsViewOpen: PropTypes.bool,
  templateActions: TemplateActionsPropType,
};
export default TemplateDetailsModal;
