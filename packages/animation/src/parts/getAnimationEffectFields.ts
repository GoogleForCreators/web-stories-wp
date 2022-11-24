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
 * Internal dependencies
 */
import { AnimationType } from '../types';
import { orderByKeys } from '../utils';
import getDefaultFieldValue from '../utils/getDefaultFieldValue';
import { fields as dropFields } from './effects/drop';
import { fields as fadeFields } from './effects/fadeIn';
import { fields as flyInFields } from './effects/flyIn';
import { fields as panFields } from './effects/pan';
import { fields as pulseFields } from './effects/pulse';
import { fields as whooshInFields } from './effects/whooshIn';
import { fields as zoomFields } from './effects/zoom';
import { fields as rotateInFields } from './effects/rotateIn';
import { fields as bgZoomFields } from './effects/backgroundZoom';
import { fields as bgPanFields } from './effects/backgroundPan';
import { fields as bgPanZoomFields } from './effects/backgroundPanAndZoom';

import { basicAnimationFields } from './defaultFields';

export function getAnimationEffectFields(type?: AnimationType) {
  const customFieldsByType: Partial<Record<AnimationType, unknown>> = {
    [AnimationType.EffectFadeIn]: fadeFields,
    [AnimationType.EffectFlyIn]: flyInFields,
    [AnimationType.EffectPan]: panFields,
    [AnimationType.EffectPulse]: pulseFields,
    [AnimationType.EffectWhooshIn]: whooshInFields,
    [AnimationType.EffectZoom]: zoomFields,
    [AnimationType.EffectDrop]: dropFields,
    [AnimationType.EffectRotateIn]: rotateInFields,
    [AnimationType.EffectBackgroundZoom]: bgZoomFields,
    [AnimationType.EffectBackgroundPan]: bgPanFields,
    [AnimationType.EffectBackgroundPanAndZoom]: bgPanZoomFields,
  };

  const customFields = (type && customFieldsByType[type]) || {};
  const allFields = {
    ...basicAnimationFields,
    ...customFields,
  };
  const allFieldsOrder = {
    ...customFields,
    ...basicAnimationFields,
  };
  let fieldOrder = Object.keys(allFieldsOrder);

  // ZoomAndPand design deviates from the normal input order by putting
  // a custom field (zoom direction) at the end. This accomodates for that.
  const zoomField = 'zoomDirection';
  if (
    type === AnimationType.EffectBackgroundPanAndZoom &&
    fieldOrder.includes(zoomField)
  ) {
    fieldOrder = fieldOrder
      .filter((field) => field !== zoomField)
      .concat([zoomField]);
  }

  // This order is important.
  // We want custom fields to appear above default fields, but we
  // also want custom fields to override any same-named default fields
  const fields = orderByKeys(allFields, fieldOrder);
  return fields;
}

export function getAnimationEffectDefaults(type: AnimationType) {
  const fields = getAnimationEffectFields(type);
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      value.defaultValue ?? getDefaultFieldValue(value.type),
    ])
  );
}
