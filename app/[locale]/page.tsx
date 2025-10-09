'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useRef } from 'react';
import { ImageProcessor, ImageProcessorRef } from '@/components/ImageProcessor';
import { ColorReplaceSettings } from '@/components/ColorReplaceSettings';
import { ColorPair } from '@/types/color';
import ToolDescription from '@/components/ToolDescription';
import UsageExamples from '@/components/UsageExamples';

export default function Home() {
  const homeT = useTranslations('HomePage');
  const [colorSettings, setColorSettings] = useState<ColorPair[]>([
    {
      id: '1',
      sourceColor: '#FFFFFF',
      targetColor: '#000000',
      tolerance: 30,
    },
  ]);
  const [defaultSettings, setDefaultSettings] = useState<ColorPair[]>([]);
  const [settingsHeight, setSettingsHeight] = useState(140);
  const imageProcessorRef = useRef<ImageProcessorRef>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [files, setFiles] = useState<File[]>([]);


  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.style.paddingTop = `${settingsHeight}px`;
    }
  }, [settingsHeight]);

  useEffect(() => {
    if (files.length > 0 && colorSettings.length > 0) {
      const previewElement = document.querySelector('[data-preview-trigger]');
      if (previewElement instanceof HTMLButtonElement) {
        previewElement.click();
      }
    }
  }, [colorSettings, files]);

  return (
    <>
      <div className="mx-auto w-full px-4 lg:container">
        <div className="fixed left-0 right-0 top-16 z-40">
          <div className="mx-auto w-full px-4 lg:container">
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

        <div ref={mainContentRef} style={{ paddingTop: `${settingsHeight}px` }}>
          <section id="color-replace-tool">
            <ImageProcessor
              colorSettings={colorSettings}
              ref={imageProcessorRef}
              onImagesChange={setFiles}
            />
          </section>

          <section className="py-12">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {homeT('title')}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {homeT('description')}
              </p>
            </div>
          </section>

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
                  ...setting,
                }));
                setDefaultSettings(formattedSettings);
                imageProcessorRef.current?.processImages();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
            onImagesUpload={(images) => {
              imageProcessorRef.current?.clearImages();

              const loadImages = async () => {
                try {
                  const responses = await Promise.all(images.map((url) => fetch(url)));

                  const blobs = await Promise.all(responses.map((res) => res.blob()));

                  const filesFromExamples = blobs.map((blob, index) => {
                    const filename = images[index].split('/').pop() || 'image.png';
                    return new File([blob], filename, { type: blob.type });
                  });

                  const fileInput = document.querySelector('input[type="file"]');
                  if (fileInput) {
                    const dataTransfer = new DataTransfer();
                    filesFromExamples.forEach((file) => dataTransfer.items.add(file));
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
    </>
  );
}
