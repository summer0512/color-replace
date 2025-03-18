'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef, use } from 'react';
import { ImageProcessor, ImageProcessorRef } from '@/components/ImageProcessor';
import { ColorReplaceSettings } from '@/components/ColorReplaceSettings';
import { ColorPair } from '@/types/color';
import ToolDescription from '@/components/ToolDescription';
import UsageExamples from '@/components/UsageExamples';
import HeadInfo from '@/components/head-info';

// Define the structure for uploaded image data
interface UploadedImage {
  id: string;
  original: string;
  name: string;
}

export default function Home(props: {params: Promise<{locale: string}>}) {
  const t = useTranslations('HomePage');
  const params = use(props.params);
  // State for managing uploaded images and color replacement settings
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [colorSettings, setColorSettings] = useState<ColorPair[]>([{
    id: '1',
    sourceColor: '#FFFFFF',
    targetColor: '#000000',
    tolerance: 30,
  }]);
  const [defaultSettings, setDefaultSettings] = useState<ColorPair[]>([]);
  const [settingsHeight, setSettingsHeight] = useState(140); // Default height
  const imageProcessorRef = useRef<ImageProcessorRef>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<File[]>([]);

  // Update main content padding when settings height changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.style.paddingTop = `${settingsHeight}px`;
    }
  }, [settingsHeight]);

  // Automatically trigger preview when settings or images change
  useEffect(() => {
    if (uploadedImages.length > 0 && colorSettings.length > 0) {
      // Find and trigger the hidden preview button
      const previewElement = document.querySelector('[data-preview-trigger]');
      if (previewElement instanceof HTMLButtonElement) {
        previewElement.click();
      }
    }
  }, [colorSettings, uploadedImages]);

  return (
    <>
      <HeadInfo 
        locale={params.locale} 
        page={''} 
        title={t('title')} 
        description={t('description')}
        keywords={t('keywords')}
      />
      <div className="mx-auto px-4 w-full lg:container">
        {/* Fixed color settings panel */}
        <div className="fixed top-16 left-0 right-0 z-40">
          <div className="mx-auto px-4 w-full lg:container">
            <ColorReplaceSettings
              defaultSettings={defaultSettings}
              onChange={(settings) => {
                setColorSettings(settings);
              }}
              onHeightChange={setSettingsHeight}
              hasFiles={files.length > 0}
            />
          </div>
        </div>

        {/* Main content with dynamic padding */}
        <div ref={mainContentRef} style={{ paddingTop: `${settingsHeight}px` }}>
          <ImageProcessor
            colorSettings={colorSettings}
            ref={imageProcessorRef}
            onImagesChange={setFiles}
          />
          <div>
            <ToolDescription />
            <UsageExamples
              onLoadExample={(settings) => {
                if (files.length > 0) {
                  const event = new CustomEvent('clearUploadedFiles');
                  window.dispatchEvent(event);
                  setFiles([]);
                }
                setTimeout(() => {
                  const time = Date.now();
                  const formattedSettings = settings.map((setting, index) => ({
                    id: `example-${time}-${index + 1}`,
                    ...setting
                  }));
                  setDefaultSettings(formattedSettings);
                // Trigger image processing after settings are loaded
                  imageProcessorRef.current?.processImages();
                  // document scroll to top
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100); // Add a small delay to ensure settings are applied
              }}
              onImagesUpload={(images) => {
                // Clear existing images first using the ref
                imageProcessorRef.current?.clearImages();

                // Create file objects from the image URLs
                const loadImages = async () => {
                  try {
                    const responses = await Promise.all(
                      images.map(url => fetch(url))
                    );

                    const blobs = await Promise.all(
                      responses.map(res => res.blob())
                    );

                    const files = blobs.map((blob, index) => {
                      const filename = images[index].split('/').pop() || 'image.png';
                      return new File([blob], filename, { type: blob.type });
                    });

                    // Trigger the hidden file input in ImageProcessor
                    const fileInput = document.querySelector('input[type="file"]');
                    if (fileInput) {
                      const dataTransfer = new DataTransfer();
                      files.forEach(file => dataTransfer.items.add(file));
                      (fileInput as HTMLInputElement).files = dataTransfer.files;
                      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                  } catch (error) {
                    console.error('Error loading example images:', error);
                  }
                };

                loadImages();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
