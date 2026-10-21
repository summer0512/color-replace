'use client'
import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { ColorPair } from '@/types/color';
import Spinner from './Spinner';
import { useLocale, useTranslations } from 'next-intl';
import { downloadProcessedImages } from './downloadProcessedImages';
import { useDownloadAd } from './ads/SiteAds';
import { getAdCopy } from '@/i18n/ads';

interface ImageFile extends File {
  preview: string;
  dimensions?: {
    width: number;
    height: number;
  };
  originalName: string;
  width?: number;
  height?: number;
  processRef?: React.RefObject<HTMLDivElement>;
}

interface ImageProcessorProps {
  colorSettings: ColorPair[];
  multiple?: boolean;
  maxSize?: number;
  onImagesChange?: (files: ImageFile[]) => void;
}

export interface ImageProcessorRef {
  clearImages: () => void;
  processImages: () => Promise<void>;
}

export const ImageProcessor = forwardRef<ImageProcessorRef, ImageProcessorProps>(({
  colorSettings,
  multiple = true,
  maxSize = 5242880, // 5MB
  onImagesChange,
}, ref) => {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean[]>([]);
  const [imageTransforms, setImageTransforms] = useState<{ scale: number; x: number; y: number }[]>([]);
  const [canvasTransforms, setCanvasTransforms] = useState<{ scale: number; x: number; y: number }[]>([]);
  const canvasRefs = useRef<(HTMLDivElement | null)[]>([]);

  const t = useTranslations('ImageProcessor');
  const adCopy = getAdCopy(useLocale());
  const showDownloadAd = useDownloadAd();
  const downloadInFlight = useRef(false);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({ width: 800, height: 320 });
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 添加一个 resize 观察器来获取容器尺寸
  useEffect(() => {
    const updateContainerDimensions = () => {
      containerRefs.current.forEach((ref, index) => {
        if (ref) {
          const { width, height } = ref.getBoundingClientRect();
          setContainerDimensions({ width, height });
        }
      });
    };

    // 初始化时获取一次尺寸
    updateContainerDimensions();

    // 添加 resize 事件监听器
    window.addEventListener('resize', updateContainerDimensions);

    return () => {
      window.removeEventListener('resize', updateContainerDimensions);
    };
  }, [files.length]);

  useEffect(() => {
    const handleClearFiles = () => {
      setFiles([]);
      onImagesChange?.([]);
      // 清空画布
      canvasRefs.current.forEach((canvas, index) => {
        if (canvas) {
          const ctx = canvas.querySelector('canvas')?.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          }
        }
      });
      // 重置变换
      setImageTransforms([]);
      setCanvasTransforms([]);
    };
  
    window.addEventListener('clearUploadedFiles', handleClearFiles);
    
    return () => {
      window.removeEventListener('clearUploadedFiles', handleClearFiles);
    };
  }, []);

  // Calculate display dimensions - 修改为使用动态容器尺寸
  const getDisplayDimensions = (originalWidth: number, originalHeight: number) => {
    const maxHeight = containerDimensions.height; // 使用容器的实际高度
    const maxWidth = containerDimensions.width;   // 使用容器的实际宽度

    if (originalHeight <= maxHeight && originalWidth <= maxWidth) {
      // If image is smaller than container, use original dimensions
      return { width: originalWidth, height: originalHeight };
    }

    // Calculate aspect ratio
    const ratio = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);

    return {
      width: Math.round(originalWidth * ratio),
      height: Math.round(originalHeight * ratio)
    };
  };
  const getImageDimensions = (file: ImageFile): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = file.preview;
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
    });
  };
  const onDrop = async (acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => {
        if (file.size > maxSize) {
          return t('error.fileTooLarge');
        }
        return t('error.invalidFormat');
      });
      setError(errors[0]);
      return;
    }

    // Handle accepted files
    const newFiles = await Promise.all(acceptedFiles.map(async (file) => {
      const preview = URL.createObjectURL(file);
      const dimensions = await getImageDimensions({ ...file, preview, originalName: file.name });
      return Object.assign(file, { preview, dimensions, originalName: file.name });
    })
    );

    setFiles(prev => [...prev, ...newFiles]);
    setError('');
    setLoading(prev => [...prev, ...Array(newFiles.length).fill(false)]);
    setImageTransforms(prev => [...prev, ...Array(newFiles.length).fill({ scale: 1, x: 0, y: 0 })]);
    setCanvasTransforms(prev => [...prev, ...Array(newFiles.length).fill({ scale: 1, x: 0, y: 0 })]);
    onImagesChange?.([...files, ...newFiles]);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple,
    maxSize,
    onDrop
  });
  const removeImage = (index: number) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
    setLoading(prev => prev.filter((_, i) => i !== index));
    setImageTransforms(prev => prev.filter((_, i) => i !== index));
    setCanvasTransforms(prev => prev.filter((_, i) => i !== index));
    onImagesChange?.(newFiles);
  };
  // 处理鼠标滚轮缩放 - 使用 useEffect 添加非 passive 的事件监听器
  const handleWheel = (e: WheelEvent, index: number) => {
    e.preventDefault(); // 阻止页面滚动

    setImageTransforms(prev => {
      const newTransforms = [...prev];
      const currentScale = newTransforms[index]?.scale || 1;
      // 缩放因子，可以调整以改变缩放速度
      const scaleFactor = 0.05;
      // 根据滚轮方向放大或缩小，最小值为基础缩放比例
      const newScale = e.deltaY < 0
        ? Math.min(currentScale + scaleFactor, 5) // 最大缩放到5倍
        : Math.max(currentScale - scaleFactor, 1); // 最小缩放为1

      newTransforms[index] = {
        ...newTransforms[index],
        scale: newScale
      };
      return newTransforms;
    });
  };
  // 使用 ref 和 useEffect 来添加非 passive 的滚轮事件监听器
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 为每个图片容器添加非 passive 的滚轮事件监听器
    imageRefs.current.forEach((ref, index) => {
      if (ref) {
        const wheelHandler = (e: WheelEvent) => handleWheel(e, index);
        ref.addEventListener('wheel', wheelHandler, { passive: false });

        // 清理函数
        return () => {
          ref.removeEventListener('wheel', wheelHandler);
        };
      }
    });
  }, [files.length]);
  // 处理拖拽平移
  const handleDragStart = (index: number) => {
    let lastX = 0;
    let lastY = 0;
    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      setImageTransforms(prev => {
        const newTransforms = [...prev];
        newTransforms[index] = {
          ...newTransforms[index],
          x: (newTransforms[index]?.x || 0) + deltaX,
          y: (newTransforms[index]?.y || 0) + deltaY
        };
        return newTransforms;
      });
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    return { onMouseDown };
  };

  // 处理画布区域的拖拽平移
  const handleCanvasDragStart = (index: number) => {
    let lastX = 0;
    let lastY = 0;
    let isDragging = false;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      setCanvasTransforms(prev => {
        const newTransforms = [...prev];
        newTransforms[index] = {
          ...newTransforms[index],
          x: (newTransforms[index]?.x || 0) + deltaX,
          y: (newTransforms[index]?.y || 0) + deltaY
        };
        return newTransforms;
      });
    };

    const onMouseUp = () => {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    return { onMouseDown };
  };

  // 处理画布区域的鼠标滚轮缩放
  const handleCanvasWheel = (e: WheelEvent, index: number) => {
    e.preventDefault(); // 阻止页面滚动

    setCanvasTransforms(prev => {
      const newTransforms = [...prev];
      const currentScale = newTransforms[index]?.scale || 1;
      // 缩放因子，可以调整以改变缩放速度
      const scaleFactor = 0.05;
      // 根据滚轮方向放大或缩小
      const newScale = e.deltaY < 0
        ? Math.min(currentScale + scaleFactor, 5) // 最大缩放到5倍
        : Math.max(currentScale - scaleFactor, 1); // 最小缩放为1

      newTransforms[index] = {
        ...newTransforms[index],
        scale: newScale
      };
      return newTransforms;
    });
  };

  // 为画布容器添加非 passive 的滚轮事件监听器
  useEffect(() => {
    canvasRefs.current.forEach((ref, index) => {
      if (ref) {
        const wheelHandler = (e: WheelEvent) => handleCanvasWheel(e, index);
        ref.addEventListener('wheel', wheelHandler, { passive: false });

        // 清理函数
        return () => {
          ref.removeEventListener('wheel', wheelHandler);
        };
      }
    });
  }, [files.length]);

  const getImageData = async (preview: string) => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = preview;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error(t('error.canvasContext'));
        }
        ctx.drawImage(img, 0, 0);
        resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
      };
    });
  };
  const processImages = async () => {
    for (const [index, file] of files.entries()) {
      setLoading(prev => {
        const newLoading = [...prev];
        newLoading[index] = true; // Show loading for this specific canvas
        return newLoading;
      });

      const { preview } = file;
      const imageData = await getImageData(preview);

      const worker = new Worker(new URL('./imageProcessorWorker.ts', import.meta.url));

      worker.postMessage({
        type: 'process',
        imageData,
        colorPairs: colorSettings
      });

      worker.onmessage = function (e) {
        if (e.data.type === 'done') {
          const processedImageData = e.data.imageData;
          const canvas = document.querySelector(`.canvas-${index} canvas`) as HTMLCanvasElement;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              throw new Error(t('error.canvasContext'));
            }
            ctx.putImageData(processedImageData, 0, 0);
          }
          // Hide loading for this specific canvas after processing
          setLoading(prev => {
            const newLoading = [...prev];
            newLoading[index] = false;
            return newLoading;
          });
        }
      };

      worker.onerror = function (error) {
        console.error('Worker error:', error);
        setLoading(prev => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
      };
    }
  };

  useEffect(() => {
    processImages();
  }, [colorSettings, files]);

  useEffect(() => {
    const handleDownload = async () => {
      if (files.length === 0) {
        setError(t('error.noFilesUploaded'));
        return;
      }
      if (downloadInFlight.current || loading.some(Boolean)) return;
      downloadInFlight.current = true;
      setError('');
      try {
        await downloadProcessedImages(files.map((file, index) => ({
          name: file.originalName ?? file.name,
          canvas: canvasRefs.current[index]?.querySelector('canvas') ?? null,
        })));
        showDownloadAd();
      } catch (error) {
        console.error('Image download failed:', error);
        setError(adCopy.downloadError);
      } finally {
        downloadInFlight.current = false;
      }
    };

    window.addEventListener('downloadProcessedImages', handleDownload);
    return () => {
      window.removeEventListener('downloadProcessedImages', handleDownload);
    };
  }, [files, loading, t, showDownloadAd, adCopy.downloadError]);

  return (
    <div>
      <div>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${error ? 'border-red-500' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <p className="text-gray-600">
              📂{isDragActive ? t('dropToUpload') : t('dragAndDrop')}📤
            </p>
            <p className="text-sm text-gray-500">
              {t('supportedFormats')}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {files.length > 0 && (
        <div className="flex flex-col rounded-lg">
          {files.map((file, index) => {
            const dimensions = file.dimensions
              ? getDisplayDimensions(file.dimensions.width, file.dimensions.height)
              : { width: 200, height: 200 }; // Fallback dimensions
            const { onMouseDown } = handleDragStart(index);
            const { onMouseDown: onCanvasMouseDown } = handleCanvasDragStart(index);
            const transform = imageTransforms[index] || { scale: 1, x: 0, y: 0 };
            const canvasTransform = canvasTransforms[index] || { scale: 1, x: 0, y: 0 };
            const baseScale = dimensions.width / (file.dimensions ? file.dimensions.width : 1);
            return (
              <div key={file.preview} className='border-2 border-dashed rounded-lg border-gray-300 mt-4 p-4 md:p-0 md:border-none'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {/* 左侧原图区域 */}
                  <div
                    ref={el => {
                      imageRefs.current[index] = el;
                      containerRefs.current[index] = el;
                    }}
                    className="relative image-wrapper checkerboard-bg h-80 flex items-center justify-center overflow-hidden"
                  >
                    <Image
                      src={file.preview}
                      alt={file.name}
                      width={dimensions.width}
                      height={dimensions.height}
                      className="object-cover cursor-move"
                      style={{
                        transform: `scale(${transform.scale}) translate(${transform.x / transform.scale}px, ${transform.y / transform.scale}px)`,
                        transition: 'transform 0.1s ease'
                      }}
                      onMouseDown={(e) => onMouseDown(e.nativeEvent)}
                      draggable={false}
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  {/* <div className={`checkerboard-bg canvas-${index} flex items-center justify-center h-80 relative overflow-hidden`}>
                    {loading[index] && <div className="loading-indicator absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><Spinner /></div>}
                    <canvas style={{ transform: `scale(${dimensions.width / file.dimensions.width}, ${dimensions.height / file.dimensions.height})` }} width={file.dimensions.width} height={file.dimensions.height} />
                  </div> */}
                  <div
                    ref={(el: HTMLDivElement | null) => {
                      if (el) {
                        canvasRefs.current[index] = el; // Assign the element to the ref
                      }
                    }}
                    className={`checkerboard-bg canvas-${index} canvas-wrapper flex items-center justify-center h-80 relative overflow-hidden cursor-move`}
                  >
                    {loading[index] && <div className="loading-indicator z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"><Spinner /></div>}
                    <div
                      className="relative"
                      style={{
                        transform: `scale(${canvasTransform.scale}) translate(${canvasTransform.x / canvasTransform.scale}px, ${canvasTransform.y / canvasTransform.scale}px)`,
                        transition: 'transform 0.1s ease'
                      }}
                      onMouseDown={(e) => onCanvasMouseDown(e.nativeEvent)}
                    >
                      <canvas
                        style={{ transform: `scale(${baseScale})` }}
                        width={file.dimensions? file.dimensions.width : 0}
                        height={file.dimensions? file.dimensions.height : 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
});
