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
 * A state for cropping an image
 *
 * Like CustomizeImageCropper in WordPress core,
 * but without setting the wp_customize parameter
 * which requires the 'customize' capability.
 *
 * @see https://github.com/WordPress/wordpress-develop/blob/baa5ba32d8698f6a6a5928bcbd4fea35bd47a8c1/src/js/media/controllers/customize-image-cropper.js
 */
const WordPressImageCropper = window.wp?.media?.controller?.Cropper?.extend?.({
  /**
   * Posts the crop details to the admin.
   *
   * Uses crop measurements when flexible in both directions.
   * Constrains flexible side based on image ratio and size of the fixed side.
   *
   * @param {Object} attachment The attachment to crop.
   * @return {Object} A jQuery promise that represents the crop image request.
   */
  doCrop: function (attachment) {
    const cropDetails = attachment.get('cropDetails'),
      control = this.get('control'),
      ratio = cropDetails.width / cropDetails.height;

    // Use crop measurements when flexible in both directions.
    if (control.params.flex_width && control.params.flex_height) {
      cropDetails.dst_width = cropDetails.width;
      cropDetails.dst_height = cropDetails.height;

      // Constrain flexible side based on image ratio and size of the fixed side.
    } else {
      cropDetails.dst_width = control.params.flex_width
        ? control.params.height * ratio
        : control.params.width;
      cropDetails.dst_height = control.params.flex_height
        ? control.params.width / ratio
        : control.params.height;
    }

    return wp.ajax.post('crop-image', {
      nonce: attachment.get('nonces').edit,
      id: attachment.get('id'),
      context: control.id,
      cropDetails: cropDetails,
    });
  },
});

export default WordPressImageCropper;
