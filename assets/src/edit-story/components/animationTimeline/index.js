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
import * as React from 'react';
import propTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
  TimelineContainer,
  TimelineLegend,
  TimelineTimingContainer,
  TimelineTitleBar,
  TimelineRow,
} from './components';
import AnimationRuler from './ruler';
import TimingBar from './timingBar';

export default function AnimationTimeline({
  animations,
  duration,
  onUpdateAnimation,
}) {
  return (
    <TimelineContainer>
      <TimelineLegend>
        <TimelineTitleBar />
        {animations.map((animation, index) => (
          <TimelineRow
            key={`timeline-animation-item-${animation.id}-legend`}
            alternating={Boolean(index % 2)}
          />
        ))}
      </TimelineLegend>
      <TimelineTimingContainer>
        <TimelineTitleBar>
          <AnimationRuler duration={duration} />
        </TimelineTitleBar>
        {animations.map((animation, index) => (
          <TimelineRow
            data-testid="timeline-animation-item"
            key={`timeline-animation-item-${animation.id}`}
            alternating={Boolean(index % 2)}
          >
            <TimingBar
              label={animation.label}
              delay={animation.delay}
              duration={animation.duration}
              maxDuration={duration}
              onUpdateAnimation={(delta) => onUpdateAnimation(animation, delta)}
            />
          </TimelineRow>
        ))}
      </TimelineTimingContainer>
    </TimelineContainer>
  );
}

AnimationTimeline.propTypes = {
  animations: propTypes.arrayOf(propTypes.object).isRequired,
  duration: propTypes.number.isRequired,
  onUpdateAnimation: propTypes.func.isRequired,
};
