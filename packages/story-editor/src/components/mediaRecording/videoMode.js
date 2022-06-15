/*
 * Copyright 2022 Google LLC
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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Icons } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { Switch } from '../form';

const Wrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 70px;
`;

const StyledSwitch = styled(Switch)`
  background: ${({ theme }) => theme.colors.bg.tertiary};
`;

const CameraIcon = styled(Icons.Camera).attrs({
  title: __('Use as video', 'web-stories'),
})`
  flex: 1;
`;

const GifIcon = styled(Icons.Gif).attrs({
  title: __('Use as GIF', 'web-stories'),
})`
  flex: 1;
`;

function VideoMode({ value, onChange }) {
  return (
    <Wrapper>
      <StyledSwitch
        groupLabel={__('Video Mode', 'web-stories')}
        name="video-mode-switch"
        value={value}
        onLabel={<CameraIcon />}
        offLabel={<GifIcon />}
        onChange={onChange}
      />
    </Wrapper>
  );
}

VideoMode.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default VideoMode;
