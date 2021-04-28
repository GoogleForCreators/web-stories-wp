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
 * Internal dependencies
 */
import {
  BACKGROUND_ANIMATION_EFFECTS,
  DIRECTION,
  SCALE_DIRECTION,
} from '../../../../../../../animation';

const updateDynamicProps = ({ animation, disabledOptions = [] }) => {
  // we don't want to have a disbaled direction initially selected either.
  const panDirection =
    animation.panDirection && !disabledOptions.includes(animation.panDirection)
      ? animation.panDirection
      : Object.values(DIRECTION).filter(
          (direction) => !disabledOptions.includes(direction)
        )?.[0] || undefined;

  switch (animation.value) {
    case BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value:
      return {
        ...animation,
        // Defautl zoomDirection to scale in unless disabled
        zoomDirection: disabledOptions.includes(SCALE_DIRECTION.SCALE_IN)
          ? SCALE_DIRECTION.SCALE_OUT
          : SCALE_DIRECTION.SCALE_IN,
        panDirection,
      };
    default:
      return animation;
  }
};

export default updateDynamicProps;
