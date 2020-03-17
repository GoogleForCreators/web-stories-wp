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
import { useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row } from '../form';
import { ReactComponent as OverlayNoneIcon } from '../../icons/overlay_none.svg';
import { ReactComponent as OverlaySolidIcon } from '../../icons/overlay_solid.svg';
import { ReactComponent as OverlayLinearIcon } from '../../icons/overlay_linear.svg';
import { ReactComponent as OverlayRadialIcon } from '../../icons/overlay_radial.svg';
import ToggleButton from '../form/toggleButton';
import { SimplePanel } from './panel';

const OverlayType = {
  NONE: 'none',
  SOLID: 'solid',
  LINEAR: 'linear',
  RADIAL: 'radial',
};

const OverlayPreset = {
  [OverlayType.NONE]: {
    label: __('None', 'web-stories'),
    icon: <OverlayNoneIcon />,
  },
  [OverlayType.SOLID]: {
    label: __('Solid', 'web-stories'),
    icon: <OverlaySolidIcon />,
  },
  [OverlayType.LINEAR]: {
    label: __('Linear', 'web-stories'),
    icon: <OverlayLinearIcon />,
  },
  [OverlayType.GRADIENT]: {
    label: __('Radial', 'web-stories'),
    icon: <OverlayRadialIcon />,
  },
};

function BackgroundOverlayPanel({ selectedElements, onSetProperties }) {
  const { overlay: initOverlay } = selectedElements[0];
  const [overlay, setOverlay] = useState(initOverlay || OverlayType.NONE);

  useEffect(() => {
    onSetProperties({ overlay });
  }, [onSetProperties, overlay]);

  return (
    <SimplePanel name="backgroundOverlay" title={__('Overlay', 'web-stories')}>
      <Row>
        {Object.keys(OverlayPreset).map((type) => {
          const { label, icon } = OverlayPreset[type];
          return (
            <ToggleButton
              key={type}
              icon={icon}
              label={label}
              value={overlay === type}
              isMultiple={false}
              onChange={() => setOverlay(type)}
            />
          );
        })}
      </Row>
    </SimplePanel>
  );
}

BackgroundOverlayPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default BackgroundOverlayPanel;
