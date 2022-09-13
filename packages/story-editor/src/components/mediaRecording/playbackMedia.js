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

/* eslint-disable jsx-a11y/media-has-caption -- Not required for recording */

/**
 * External dependencies
 */
import { __ } from '@googleforcreators/i18n';
import { useCallback, useRef, useEffect } from '@googleforcreators/react';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';

/**
 * Internal dependencies
 */
import useVideoTrim from '../videoTrim/useVideoTrim';
import useMediaRecording from './useMediaRecording';
import VideoMode from './videoMode';
import PlayPauseButton from './playPauseButton';
import { VideoWrapper, Video, Photo, Canvas } from './components';
import Audio from './audio';
import { BACKGROUND_BLUR_PX, VIDEO_EFFECTS } from './constants';

const selfieSegmentation = new SelfieSegmentation({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
});
selfieSegmentation.setOptions({
  modelSelection: 1,
});
selfieSegmentation.initialize();

function PlaybackMedia() {
  const {
    mediaBlob,
    mediaBlobUrl,
    originalMediaBlobUrl,
    liveStream,
    hasVideo,
    hasAudio,
    videoEffect,
    isGif,
    isImageCapture,
    isAdjustingTrim,
    toggleIsGif,
    streamNode,
    setStreamNode,
    isProcessingTrim,
    setCanvasStream,
    setCanvasNode,
  } = useMediaRecording(({ state, actions }) => ({
    mediaBlob: state.mediaBlob,
    mediaBlobUrl: state.mediaBlobUrl,
    originalMediaBlobUrl: state.originalMediaBlobUrl,
    liveStream: state.liveStream,
    hasVideo: state.hasVideo,
    hasAudio: state.hasAudio,
    videoEffect: state.videoEffect,
    isGif: state.isGif,
    streamNode: state.streamNode,
    isImageCapture: Boolean(state.file?.type?.startsWith('image')),
    isAdjustingTrim: state.isAdjustingTrim,
    toggleIsGif: actions.toggleIsGif,
    setStreamNode: actions.setStreamNode,
    isProcessingTrim: state.isProcessingTrim,
    setCanvasStream: actions.setCanvasStream,
    setCanvasNode: actions.setCanvasNode,
  }));
  const setVideoNode = useVideoTrim(
    ({ actions: { setVideoNode } }) => setVideoNode
  );

  const isMuted = !hasAudio || isGif;
  const hasVideoEffect = videoEffect && videoEffect !== VIDEO_EFFECTS.NONE;

  const onToggleVideoMode = useCallback(() => {
    toggleIsGif();
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [toggleIsGif]);

  const rafRef = useRef();
  const canvasRef = useRef();
  const videoRef = useRef();
  const updateVideoNode = useCallback(
    (node) => {
      setVideoNode(node);
      videoRef.current = node;
    },
    [setVideoNode]
  );

  const onSelfieSegmentationResults = (results) => {
    const canvas = canvasRef.current;
    if (!canvas || !results.image || results.image.width === 0) {
      return;
    }
    const context = canvasRef.current.getContext('2d');

    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);

    const width = canvas.width;
    const height = canvas.height;
    const numPixels = width * height;
    const image = results.image;
    const radius = BACKGROUND_BLUR_PX;

    const imageFloatLinear = new Float32Array(numPixels * 4);
    const imageTemp = new Float32Array(imageFloatLinear.length);
    context.drawImage(image, 0, 0, width, height);
    const imageData = context.getImageData(0, 0, width, height);
    const buffer = imageData.data;

    for (let ch = 0; ch < 3; ch++) {
      for (let i = 0; i < numPixels; i++) {
        imageFloatLinear[ch * numPixels + i] = Math.pow(
          buffer[i * 4 + ch] / 255,
          2.2
        );
      } // Gamma to linear
    }
    for (let i = 0; i < numPixels; i++) {
      imageFloatLinear[3 * numPixels + i] = 1;
    }

    const linearToGamma = new Array(4096 + 1);
    for (let i = 0; i < linearToGamma.length; i++) {
      linearToGamma[i] = Math.round(
        Math.pow(i / (linearToGamma.length - 1), 1 / 2.2) * 255
      );
    }

    function FftConvolver(kernelReal, kernelImag) {
      if (kernelImag === undefined) {
        kernelImag = new Float32Array(kernelReal.length);
      }

      const length = kernelReal.length;
      if (length === 1) {
        throw new RangeError('Trivial transform');
      }
      let levels = -1;
      for (let i = 0; i < 32; i++) {
        if (1 << i === length) {
          levels = i;
        }
      }
      if (levels === -1) {
        throw new RangeError('Length is not a power of 2');
      }

      const cosTable = new Float32Array(length / 2);
      const sinTable = new Float32Array(length / 2);
      for (let i = 0; i < length / 2; i++) {
        cosTable[i] = Math.cos((2 * Math.PI * i) / length);
        sinTable[i] = Math.sin((2 * Math.PI * i) / length);
      }
      const bitRevTable = new Uint32Array(length);
      for (let i = 0; i < length; i++) {
        bitRevTable[i] = reverseBits(i, levels);
      }

      transform(kernelReal, kernelImag);

      this.convolve = function (real, imag) {
        transform(real, imag);
        for (let i = 0; i < length; i++) {
          const temp = real[i] * kernelReal[i] - imag[i] * kernelImag[i];
          imag[i] = imag[i] * kernelReal[i] + real[i] * kernelImag[i];
          real[i] = temp;
        }
        transform(imag, real);
      };

      function transform(real, imag) {
        if (real.length !== length || imag.length !== length) {
          throw new RangeError('Mismatched lengths');
        }

        for (let i = 0; i < length; i++) {
          const j = bitRevTable[i];
          if (j > i) {
            let temp = real[i];
            real[i] = real[j];
            real[j] = temp;
            temp = imag[i];
            imag[i] = imag[j];
            imag[j] = temp;
          }
        }

        for (let size = 2; size <= length; size *= 2) {
          const halfsize = size / 2;
          const tablestep = length / size;
          for (let i = 0; i < length; i += size) {
            for (let j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
              const tpre =
                real[j + halfsize] * cosTable[k] +
                imag[j + halfsize] * sinTable[k];
              const tpim =
                -real[j + halfsize] * sinTable[k] +
                imag[j + halfsize] * cosTable[k];
              real[j + halfsize] = real[j] - tpre;
              imag[j + halfsize] = imag[j] - tpim;
              real[j] += tpre;
              imag[j] += tpim;
            }
          }
        }
      }

      function reverseBits(x, bits) {
        let y = 0;
        for (let i = 0; i < bits; i++) {
          y = (y << 1) | (x & 1);
          x >>>= 1;
        }
        return y;
      }
    }

    function makeGaussianKernel(stdDev, dataLen) {
      const kernel = [];
      const scaler = -1 / (2 * stdDev * stdDev);
      for (let i = 0; i < dataLen; i++) {
        const temp = Math.exp(i * i * scaler);
        kernel.push(temp);
        if (temp < 1e-6) {
          break;
        }
      }

      let length = 1;
      while (length < dataLen + kernel.length - 1) {
        length *= 2;
      }
      const result = new Float32Array(length);

      result[0] = kernel[0];
      for (let i = 0; i < kernel.length; i++) {
        result[i] = kernel[i];
        result[length - i] = kernel[i];
      }
      return result;
    }

    function doRowConvolutions(imageIn, imageOut) {
      const kernel = makeGaussianKernel(radius, width);
      const length = kernel.length;
      const convolver = new FftConvolver(kernel);
      const lineReal = new Float32Array(length);
      const lineImag = new Float32Array(length);
      for (let ch = 0; ch < 4; ch += 2) {
        for (let y = 0; y < height; y++) {
          const off0 = ch * numPixels + y * width;
          const off1 = (ch + 1) * numPixels + y * width;
          let x;
          for (x = 0; x < width; x++) {
            lineReal[x] = imageIn[off0 + x];
            lineImag[x] = imageIn[off1 + x];
          }
          for (; x < length; x++) {
            lineReal[x] = lineImag[x] = 0;
          }
          convolver.convolve(lineReal, lineImag);
          for (x = 0; x < width; x++) {
            imageOut[off0 + x] = lineReal[x];
            imageOut[off1 + x] = lineImag[x];
          }
        }
      }
    }

    function doColumnConvolutions(imageIn, imageOut) {
      const kernel = makeGaussianKernel(radius, height);
      const length = kernel.length;
      const convolver = new FftConvolver(kernel);
      const lineReal = new Float32Array(length);
      const lineImag = new Float32Array(length);
      for (let ch = 0; ch < 4; ch += 2) {
        for (let x = 0; x < width; x++) {
          const off0 = ch * numPixels + x;
          const off1 = (ch + 1) * numPixels + x;
          let y;
          for (y = 0; y < height; y++) {
            lineReal[y] = imageIn[off0 + y * width];
            lineImag[y] = imageIn[off1 + y * width];
          }
          for (; y < length; y++) {
            lineReal[y] = lineImag[y] = 0;
          }
          convolver.convolve(lineReal, lineImag);
          for (y = 0; y < height; y++) {
            imageOut[off0 + y * width] = lineReal[y];
            imageOut[off1 + y * width] = lineImag[y];
          }
        }
      }
    }

    function convertToByteGamma(imageIn, imageOut) {
      const lgSteps = linearToGamma.length - 1;
      for (let i = 0; i < numPixels; i++) {
        const weight = imageIn[3 * numPixels + i];
        for (let ch = 0; ch < 3; ch++) {
          const val = imageIn[ch * numPixels + i] / weight;
          imageOut[i * 4 + ch] = linearToGamma[Math.round(val * lgSteps)];
        }
      }
    }

    if (!('filter' in CanvasRenderingContext2D.prototype)) {
      context.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      doRowConvolutions(imageFloatLinear, imageTemp);
      doColumnConvolutions(imageTemp, imageTemp);
      convertToByteGamma(imageTemp, imageData.data);
      context.putImageData(imageData, 0, 0);
    }

    context.globalCompositeOperation = 'destination-out';
    context.drawImage(
      results.segmentationMask,
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.globalCompositeOperation = 'destination-over';
    context.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    context.restore();
  };

  useEffect(() => {
    async function run() {
      await selfieSegmentation.initialize();

      if (hasVideoEffect && canvasRef.current) {
        canvasRef.current.getContext('2d');
        setCanvasNode(canvasRef.current);
        setCanvasStream(canvasRef.current.captureStream());
      }
      if (videoEffect === VIDEO_EFFECTS.BLUR) {
        selfieSegmentation.onResults(onSelfieSegmentationResults);
        const sendFrame = async () => {
          if (streamNode && streamNode.videoWidth && selfieSegmentation) {
            await selfieSegmentation.send({ image: streamNode });
          }
          rafRef.current = requestAnimationFrame(sendFrame);
        };
        if (streamNode && hasVideoEffect) {
          await sendFrame();
        }
      }
    }
    run();
  }, [videoEffect, hasVideoEffect, streamNode, setCanvasStream, setCanvasNode]);

  // Only previewing a gif means that the play button is hidden,
  // not while trimming (even if gif)
  const hasPlayButton = (!isGif && !isProcessingTrim) || isAdjustingTrim;
  const mediaSrc = isAdjustingTrim ? originalMediaBlobUrl : mediaBlobUrl;

  const hasVideoModeSwitch =
    mediaBlobUrl && hasVideo && !isAdjustingTrim && !isProcessingTrim;

  useEffect(() => {
    if (mediaBlobUrl) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    }
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [mediaBlobUrl]);

  if (isImageCapture) {
    return (
      <VideoWrapper>
        <Photo
          decoding="async"
          src={mediaBlobUrl}
          alt={__('Image capture', 'web-stories')}
        />
      </VideoWrapper>
    );
  }

  const onLoadedMetadata = () => {
    if (!canvasRef.current) {
      return;
    }
    canvasRef.current.width = streamNode.videoWidth;
    canvasRef.current.height = streamNode.videoHeight;
  };

  return (
    <>
      {hasVideoModeSwitch && (
        <VideoMode value={!isGif} onChange={onToggleVideoMode} />
      )}
      <VideoWrapper>
        {mediaBlobUrl &&
          (hasVideo ? (
            <>
              <Video
                ref={updateVideoNode}
                src={mediaSrc}
                muted={isMuted}
                loop={isGif || isAdjustingTrim}
                $isProcessing={isProcessingTrim}
                tabIndex={0}
              />
              {hasPlayButton && <PlayPauseButton videoRef={videoRef} />}
            </>
          ) : (
            <audio controls="controls" src={mediaBlobUrl} />
          ))}
        {!mediaBlob &&
          !mediaBlobUrl &&
          liveStream &&
          (hasVideo ? (
            <>
              <Video
                ref={setStreamNode}
                muted
                onLoadedMetadata={onLoadedMetadata}
              />
              {hasVideoEffect && (
                <Canvas ref={canvasRef} width={640} height={480} />
              )}
            </>
          ) : (
            <Audio liveStream={liveStream} />
          ))}
      </VideoWrapper>
    </>
  );
}

export default PlaybackMedia;

/* eslint-enable jsx-a11y/media-has-caption -- Reenabling */
