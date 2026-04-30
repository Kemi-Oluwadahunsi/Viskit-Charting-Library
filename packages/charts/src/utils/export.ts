// ─────────────────────────────────────────────────
// Export Utilities — exportToPNG / exportToSVG
// ─────────────────────────────────────────────────
// Utility functions to export a chart's SVG element
// as a PNG image or SVG markup string.
//
// Usage:
//   const svgEl = chartRef.current?.querySelector('svg');
//   exportToPNG(svgEl, { filename: 'chart.png' });
//   exportToSVG(svgEl, { filename: 'chart.svg' });
// ─────────────────────────────────────────────────

export interface ExportOptions {
  /** Output filename (default: 'chart') */
  filename?: string;
  /** Background color (default: '#ffffff') */
  backgroundColor?: string;
  /** Scale factor for PNG (default: 2 for retina) */
  scale?: number;
  /** Image width override in px */
  width?: number;
  /** Image height override in px */
  height?: number;
}

function serializeSVG(svgElement: SVGSVGElement, options: ExportOptions): string {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;

  // Set explicit dimensions
  const width = options.width ?? svgElement.clientWidth;
  const height = options.height ?? svgElement.clientHeight;
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  // Inject background
  if (options.backgroundColor) {
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '100%');
    bg.setAttribute('height', '100%');
    bg.setAttribute('fill', options.backgroundColor);
    clone.insertBefore(bg, clone.firstChild);
  }

  const serializer = new XMLSerializer();
  return serializer.serializeToString(clone);
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function exportToSVG(
  svgElement: SVGSVGElement | null | undefined,
  options: ExportOptions = {},
): void {
  if (!svgElement) return;

  const { filename = 'chart', backgroundColor = '#ffffff' } = options;
  const svgString = serializeSVG(svgElement, { ...options, backgroundColor });
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  triggerDownload(url, filename.endsWith('.svg') ? filename : `${filename}.svg`);
  URL.revokeObjectURL(url);
}

export function exportToPNG(
  svgElement: SVGSVGElement | null | undefined,
  options: ExportOptions = {},
): Promise<void> {
  if (!svgElement) return Promise.resolve();

  const {
    filename = 'chart',
    backgroundColor = '#ffffff',
    scale = 2,
    width: widthOverride,
    height: heightOverride,
  } = options;

  const width = widthOverride ?? svgElement.clientWidth;
  const height = heightOverride ?? svgElement.clientHeight;
  const svgString = serializeSVG(svgElement, { ...options, backgroundColor });

  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get 2d context'));
        return;
      }

      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create PNG blob'));
          return;
        }
        const url = URL.createObjectURL(blob);
        triggerDownload(url, filename.endsWith('.png') ? filename : `${filename}.png`);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    };

    img.onerror = () => reject(new Error('Failed to load SVG as image'));
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    img.src = URL.createObjectURL(svgBlob);
  });
}
