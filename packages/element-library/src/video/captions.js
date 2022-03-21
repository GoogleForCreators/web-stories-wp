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
import PropTypes from 'prop-types';
import { ResourcePropTypes } from '@googleforcreators/media';

function Captions({ tracks, kind }) {
  if (!tracks) {
    return null;
  }

  return tracks.map(
    ({ srclang, label, kind: trackKind, track, id: key }, i) => (
      <track
        srcLang={srclang}
        label={label}
        kind={kind || trackKind}
        src={track}
        key={key}
        default={i === 0}
      />
    )
  );
}
Captions.propTypes = {
  kind: PropTypes.string,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
};

export default Captions;
