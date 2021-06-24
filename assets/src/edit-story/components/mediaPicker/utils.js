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
 * Returns a set of options, computed from the attached image data and
 * control-specific data, to be fed to the imgAreaSelect plugin in
 * wp.media.view.Cropper.
 *
 * @param {wp.media.model.Attachment} attachment Attachment object.
 * @param {wp.media.controller.Cropper} controller wp.media controller object.
 * @return {Object} Options
 */
export const calculateImageSelectOptions = (attachment, controller) => {
  const control = controller.get('control');
  const flexWidth = Boolean(parseInt(control.params.flex_width));
  const flexHeight = Boolean(parseInt(control.params.flex_height));
  const realWidth = attachment.get('width');
  const realHeight = attachment.get('height');
  let xInit = parseInt(control.params.width);
  let yInit = parseInt(control.params.height);
  const ratio = xInit / yInit;
  const xImg = xInit;
  const yImg = yInit;

  controller.set(
    'canSkipCrop',
    !control.mustBeCropped(
      flexWidth,
      flexHeight,
      xInit,
      yInit,
      realWidth,
      realHeight
    )
  );

  if (realWidth / realHeight > ratio) {
    yInit = realHeight;
    xInit = yInit * ratio;
  } else {
    xInit = realWidth;
    yInit = xInit / ratio;
  }

  const x1 = (realWidth - xInit) / 2;
  const y1 = (realHeight - yInit) / 2;

  const imgSelectOptions = {
    handles: true,
    keys: true,
    instance: true,
    persistent: true,
    imageWidth: realWidth,
    imageHeight: realHeight,
    minWidth: xImg > xInit ? xInit : xImg,
    minHeight: yImg > yInit ? yInit : yImg,
    x1: x1,
    y1: y1,
    x2: xInit + x1,
    y2: yInit + y1,
  };

  if (flexHeight === false && flexWidth === false) {
    imgSelectOptions.aspectRatio = xInit + ':' + yInit;
  }

  if (true === flexHeight) {
    delete imgSelectOptions.minHeight;
    imgSelectOptions.maxWidth = realWidth;
  }

  if (true === flexWidth) {
    delete imgSelectOptions.minWidth;
    imgSelectOptions.maxHeight = realHeight;
  }

  return imgSelectOptions;
};

/**
 * Return whether the image must be cropped, based on required dimensions.
 *
 * @param {boolean} flexW Flexible width.
 * @param {boolean} flexH Flexible height.
 * @param {number}  dstW Destination width.
 * @param {number}  dstH Destination height.
 * @param {number}  imgW Image Width.
 * @param {number}  imgH Image height.
 * @return {boolean} Weather or not an image must be cropped or not.
 */
export const mustBeCropped = (flexW, flexH, dstW, dstH, imgW, imgH) => {
  if (true === flexW && true === flexH) {
    return false;
  }

  if (true === flexW && dstH === imgH) {
    return false;
  }

  if (true === flexH && dstW === imgW) {
    return false;
  }

  if (dstW === imgW && dstH === imgH) {
    return false;
  }

  if (imgW <= dstW) {
    return false;
  }

  return true;
};
