#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const DEFAULT_BASE_URL = 'http://localhost:3000';
const DEFAULT_URL_PATHS = [
  '',
];

function printUsage() {
  console.log(`\nUsage:\n  pnpm screenshots\n  pnpm screenshots -- [--base-url http://127.0.0.1:3000] <url1> <url2> ...\n\nDefault mode:\n  Edit DEFAULT_URL_PATHS in scripts/capture-screenshots.mjs, then run pnpm screenshots\n\nExamples:\n  pnpm screenshots\n  pnpm screenshots -- --base-url http://127.0.0.1:3000 /word-search /word-search/animals\n`);
}

function parseArgs(argv) {
  const args = [...argv];
  let baseUrl = '';
  const urls = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--') continue;

    if (arg === '--help' || arg === '-h') {
      return { help: true, baseUrl: '', urls: [] };
    }

    if (arg === '--base-url') {
      const next = args[i + 1];
      if (!next) throw new Error('--base-url requires a value');
      baseUrl = next;
      i += 1;
      continue;
    }

    urls.push(arg);
  }

  return { help: false, baseUrl, urls };
}

function toAbsoluteUrl(input, baseUrl) {
  if (/^https?:\/\//i.test(input)) return input;
  if (!baseUrl) throw new Error(`Relative URL "${input}" requires --base-url`);
  return new URL(input, baseUrl).toString();
}

function fileNameFromUrl(urlString, index) {
  const url = new URL(urlString);
  const host = url.hostname.replace(/[^a-zA-Z0-9.-]/g, '_');
  const pathname = url.pathname === '/' ? 'home' : url.pathname.replace(/^\//, '').replace(/\//g, '__');
  const query = url.search ? `__q_${url.search.slice(1).replace(/[^a-zA-Z0-9._-]/g, '_')}` : '';
  const hash = url.hash ? `__h_${url.hash.slice(1).replace(/[^a-zA-Z0-9._-]/g, '_')}` : '';
  const safe = `${String(index + 1).padStart(2, '0')}__${host}__${pathname}${query}${hash}`.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${safe}.png`;
}

function escapeXml(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function trimText(input, maxLength = 220) {
  const text = (input || '').replace(/\s+/g, ' ').trim();
  if (!text) return '(empty)';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}...`;
}

function chunkText(input, maxLength = 170) {
  const text = (input || '').replace(/\s+/g, ' ').trim();
  if (!text) return ['(empty)'];
  if (text.length <= maxLength) return [text];

  const parts = [];
  let remaining = text;
  while (remaining.length > maxLength) {
    let splitAt = remaining.lastIndexOf(' ', maxLength);
    if (splitAt < Math.floor(maxLength * 0.5)) splitAt = maxLength;
    parts.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }
  if (remaining) parts.push(remaining);
  return parts;
}

async function prependMetadataHeader(params) {
  const { imagePath, pageUrl, metadata } = params;
  const image = sharp(imagePath);
  const meta = await image.metadata();
  const width = meta.width ?? 1440;

  const lines = [];
  const pushField = (label, value) => {
    const rows = chunkText(value, 170);
    rows.forEach((row, idx) => {
      lines.push(idx === 0 ? `${label} ${row}` : `  ${row}`);
    });
  };

  pushField('URL:', pageUrl);
  pushField('Title:', trimText(metadata.title, 240));
  pushField('Meta description:', trimText(metadata.metaDescription, 480));
  pushField('H1:', trimText(metadata.h1, 260));
  pushField('H2/H3:', trimText(metadata.h2h3Structure, 700));
  pushField('FAQ:', trimText(metadata.faq, 700));
  pushField('CTA:', trimText(metadata.cta, 700));
  pushField('Related links:', trimText(metadata.relatedLinks, 900));

  const lineHeight = 24;
  const headerPadding = 18;
  const headerHeight = headerPadding * 2 + lines.length * lineHeight;
  const textYStart = 36;
  const svgText = lines
    .map((line, idx) => `<text x="18" y="${textYStart + idx * lineHeight}">${escapeXml(line)}</text>`)
    .join('');

  const headerSvg = `
    <svg width="${width}" height="${headerHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${width}" height="${headerHeight}" fill="#0b1220" />
      <text x="18" y="18" fill="#93c5fd" font-size="11" font-family="monospace">PrintableGen Screenshot Summary</text>
      <g fill="#e2e8f0" font-size="13" font-family="monospace">${svgText}</g>
    </svg>
  `;

  const headerPng = await sharp(Buffer.from(headerSvg)).png().toBuffer();
  const bodyPng = await fs.readFile(imagePath);
  const output = await sharp({
    create: {
      width,
      height: (meta.height ?? 0) + headerHeight,
      channels: 4,
      background: '#ffffff',
    },
  })
    .composite([
      { input: headerPng, top: 0, left: 0 },
      { input: bodyPng, top: headerHeight, left: 0 },
    ])
    .png()
    .toBuffer();

  await fs.writeFile(imagePath, output);
}

async function getChromium() {
  try {
    const playwright = await import('playwright');
    return playwright.chromium;
  } catch {
    throw new Error('Missing dependency: playwright. Install with `pnpm add -D playwright` and run `pnpm exec playwright install chromium`.');
  }
}

async function main() {
  const { help, baseUrl, urls } = parseArgs(process.argv.slice(2));
  if (help) {
    printUsage();
    return;
  }

  const hasCliUrls = urls.length > 0;
  const resolvedBaseUrl = baseUrl || DEFAULT_BASE_URL;
  const targetUrls = hasCliUrls ? urls : DEFAULT_URL_PATHS;
  const outputDir = path.resolve(process.cwd(), 'screenshot');
  await fs.mkdir(outputDir, { recursive: true });

  const chromium = await getChromium();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  try {
    for (let i = 0; i < targetUrls.length; i += 1) {
      const raw = targetUrls[i];
      const absoluteUrl = toAbsoluteUrl(raw, resolvedBaseUrl);
      const fileName = fileNameFromUrl(absoluteUrl, i);
      const filePath = path.join(outputDir, fileName);

      const page = await context.newPage();
      console.log(`Opening: ${absoluteUrl}`);
      await page.goto(absoluteUrl, { waitUntil: 'networkidle', timeout: 60_000 });

      const metadata = await page.evaluate(() => {
        const getMeta = (selector) => document.querySelector(selector)?.getAttribute('content') ?? '';
        const norm = (value) => (value || '').replace(/\s+/g, ' ').trim();
        const takeVisibleTexts = (nodes, limit = 8) => nodes
          .map((el) => norm(el.textContent || ''))
          .filter(Boolean)
          .slice(0, limit);

        const h1 = norm(document.querySelector('h1')?.textContent || '');
        const h2Items = takeVisibleTexts(Array.from(document.querySelectorAll('h2')), 12);
        const h3Items = takeVisibleTexts(Array.from(document.querySelectorAll('h3')), 12);
        const h2h3Structure = [
          h2Items.length ? `H2(${h2Items.length}): ${h2Items.join(' | ')}` : 'H2: (none)',
          h3Items.length ? `H3(${h3Items.length}): ${h3Items.join(' | ')}` : 'H3: (none)',
        ].join(' || ');

        const faqSchema = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
          .map((script) => script.textContent || '')
          .filter(Boolean)
          .flatMap((raw) => {
            try {
              const parsed = JSON.parse(raw);
              const list = Array.isArray(parsed) ? parsed : [parsed];
              return list;
            } catch {
              return [];
            }
          })
          .flatMap((item) => {
            if (!item || typeof item !== 'object') return [];
            const type = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
            if (!type.includes('FAQPage')) return [];
            const mainEntity = Array.isArray(item.mainEntity) ? item.mainEntity : [];
            return mainEntity.map((qa) => norm(qa?.name || '')).filter(Boolean);
          });

        const faqDomHeadings = takeVisibleTexts(
          Array.from(document.querySelectorAll('section, div, article'))
            .filter((el) => /faq|frequently asked/i.test(el.id || '') || /faq|frequently asked/i.test(el.className || ''))
            .flatMap((el) => Array.from(el.querySelectorAll('h2, h3, h4, summary'))),
          10
        );

        const faqItems = [...faqSchema, ...faqDomHeadings].filter((v, i, arr) => arr.indexOf(v) === i);
        const faq = faqItems.length ? faqItems.join(' | ') : '(none)';

        const ctaCandidates = Array.from(document.querySelectorAll('a, button, [role="button"], input[type="submit"]'))
          .map((el) => ({
            text: norm(el.textContent || el.getAttribute('aria-label') || el.getAttribute('value') || ''),
            href: el instanceof HTMLAnchorElement ? (el.getAttribute('href') || '') : '',
          }))
          .filter((item) => item.text.length >= 2)
          .filter((item) => /print|download|pdf|generator|create|generate|try|get|free|answer|start/i.test(item.text))
          .slice(0, 10);
        const cta = ctaCandidates.length
          ? ctaCandidates.map((item) => (item.href ? `${item.text} (${item.href})` : item.text)).join(' | ')
          : '(none)';

        const relatedContainerHints = /related|more|recommended|similar|you may also|internal links|resources|read next|next steps/i;
        const relatedLinks = Array.from(document.querySelectorAll('section, nav, aside, div'))
          .filter((el) => {
            const id = (el.id || '').toLowerCase();
            const cls = (typeof el.className === 'string' ? el.className : '').toLowerCase();
            const title = norm(el.textContent || '').slice(0, 140).toLowerCase();
            return relatedContainerHints.test(id) || relatedContainerHints.test(cls) || relatedContainerHints.test(title);
          })
          .flatMap((el) => Array.from(el.querySelectorAll('a[href]')))
          .map((a) => {
            const text = norm(a.textContent || '');
            const href = a.getAttribute('href') || '';
            return text && href ? `${text} (${href})` : '';
          })
          .filter(Boolean)
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .slice(0, 14);

        const fallbackInternalLinks = Array.from(document.querySelectorAll('a[href^="/"]'))
          .map((a) => {
            const text = norm(a.textContent || '');
            const href = a.getAttribute('href') || '';
            return text && href ? `${text} (${href})` : '';
          })
          .filter(Boolean)
          .filter((v, i, arr) => arr.indexOf(v) === i)
          .slice(0, 14);

        return {
          title: document.title ?? '',
          metaDescription: getMeta('meta[name="description"]'),
          h1,
          h2h3Structure,
          faq,
          cta,
          relatedLinks: relatedLinks.length ? relatedLinks.join(' | ') : (fallbackInternalLinks.length ? fallbackInternalLinks.join(' | ') : '(none)'),
        };
      });

      await page.screenshot({ path: filePath, fullPage: true });
      await prependMetadataHeader({ imagePath: filePath, pageUrl: absoluteUrl, metadata });
      await page.close();
      console.log(`Saved: ${filePath}`);
    }
  } finally {
    await context.close();
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
