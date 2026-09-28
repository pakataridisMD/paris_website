import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const alt = 'Dr. Paraskevas Pakataridis, MD';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#0c0c0c';
const BONE = '#f1ede5';
const BRASS = '#b89a68';

/* Fetches only the glyphs needed from Google Fonts. Returns null when offline,
   in which case the card falls back to the built-in font. */
async function googleFont(family: string, text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`,
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Home' });
  const first = t('firstName');
  const last = t('lastName');
  const roles = t('eyebrow');
  const based = t('based');

  const [photo, emblem, serif, serifItalic, sans] = await Promise.all([
    readFile(join(process.cwd(), 'public/images/headshot.jpg')),
    readFile(join(process.cwd(), 'public/emblem.svg'), 'utf8'),
    googleFont('Noto+Serif+Display:wght@300', first),
    googleFont('Noto+Serif+Display:ital,wght@1,300', last),
    googleFont('Inter+Tight:wght@400', roles + based),
  ]);

  const fonts = [
    serif && { name: 'Serif', data: serif, weight: 300 as const, style: 'normal' as const },
    serifItalic && { name: 'Serif', data: serifItalic, weight: 300 as const, style: 'italic' as const },
    sans && { name: 'Sans', data: sans, weight: 400 as const, style: 'normal' as const },
  ].filter((f) => !!f);

  const photoSrc = `data:image/jpeg;base64,${photo.toString('base64')}`;
  const emblemSrc = `data:image/svg+xml;base64,${Buffer.from(
    emblem.replace(/currentColor/g, BRASS),
  ).toString('base64')}`;

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: INK, color: BONE }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '60px 72px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={emblemSrc} width={60} height={60} alt='' />
            <div style={{ fontFamily: 'Sans', fontSize: 22, letterSpacing: 2, color: BRASS }}>{roles}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'Serif', fontSize: 104, lineHeight: 1, letterSpacing: -3 }}>
              {first}
            </div>
            <div
              style={{
                fontFamily: 'Serif',
                fontStyle: 'italic',
                fontSize: 104,
                lineHeight: 1.1,
                letterSpacing: -2,
                color: BRASS,
              }}
            >
              {last}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 1, background: BRASS }} />
            <div style={{ fontFamily: 'Sans', fontSize: 20, color: 'rgba(241,237,229,0.55)' }}>{based}</div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          width={440}
          height={630}
          alt=''
          style={{ objectFit: 'cover', objectPosition: '50% 25%' }}
        />
      </div>
    ),
    { ...size, fonts },
  );
}
