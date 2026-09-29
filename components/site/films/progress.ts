import type { Scene } from '../reel';
import writing from '@/public/images/reel/01-writing.jpg';
import pyramids from '@/public/images/reel/02-pyramids.jpg';
import parthenon from '@/public/images/reel/03-parthenon.jpg';
import euclid from '@/public/images/reel/04-euclid.jpg';
import pantheon from '@/public/images/reel/05-pantheon.jpg';
import florence from '@/public/images/reel/06-florence.jpg';
import gutenberg from '@/public/images/reel/07-gutenberg.jpg';
import vitruvian from '@/public/images/reel/08-vitruvian.jpg';
import magellan from '@/public/images/reel/09-magellan.jpg';
import newton from '@/public/images/reel/10-newton.jpg';
import watt from '@/public/images/reel/11-watt.jpg';
import xray from '@/public/images/reel/12-xray.jpg';
import flight from '@/public/images/reel/13-flight.jpg';
import dam from '@/public/images/reel/14-dam.jpg';
import moon from '@/public/images/reel/15-moon.jpg';
import chip from '@/public/images/reel/16-chip.jpg';
import hubble from '@/public/images/reel/17-hubble.jpg';
import sun from '@/public/images/reel/18-sun.jpg';

/* Human progress, for the Business page. Every frame is public domain or CC0,
   from Wikimedia Commons: Met Museum cuneiform tablet (CC0) · F. Bonfils,
   Giza (Museo Egizio, CC0) · Parthenon drawing, 1869 (Cooper Hewitt) ·
   Raphael, The School of Athens · G. P. Panini, Interior of the Pantheon
   (NGA, CC0) · Photochrom of Florence (LoC) · Gutenberg Bible, Genesis ·
   Leonardo, Vitruvian Man · A. Ortelius, Maris Pacifici · Newton, Principia
   (1687) · Watt's rotative engine (c. 1782) · Röntgen's first X-ray (1895) ·
   Wright brothers, first flight (1903) · Ansel Adams, Hoover Dam (NARA) ·
   NASA, Apollo 11 · Intel 4004 layout (CC0) · NASA/Hubble Ultra Deep Field.
   The black hole is rendered live (see black-hole.tsx); NASA SDO's Sun is
   only its fallback where WebGL is unavailable.

   Paced rather than metronomic: four opening hits, a breath, acceleration, a
   moment of thought, the machine age, silence on the Moon, then ever faster
   to light speed, and a long fall into a black hole. */
export const PROGRESS: Scene[] = [
  { src: writing, position: '50% 50%', origin: '50% 50%', cut: 'slam', ms: 1000 },
  { src: pyramids, position: '45% 45%', origin: '45% 35%', cut: 'punch', ms: 1000 },
  { src: parthenon, position: '40% 50%', origin: '40% 45%', cut: 'shake', ms: 1000 },
  { src: euclid, position: '55% 60%', origin: '65% 70%', cut: 'slam', ms: 1000 },
  { src: pantheon, position: '50% 30%', origin: '50% 20%', cut: 'drift', ms: 1700 },
  { src: florence, position: '58% 40%', origin: '58% 40%', cut: 'focus', ms: 1400 },
  { src: gutenberg, position: '35% 50%', origin: '40% 60%', cut: 'mega', ms: 850 },
  { src: vitruvian, position: '50% 45%', origin: '50% 35%', cut: 'punch', ms: 750 },
  { src: magellan, position: '62% 55%', origin: '60% 58%', cut: 'swipe', ms: 750 },
  { src: newton, position: '50% 45%', origin: '50% 45%', cut: 'focus', ms: 1400 },
  { src: watt, position: '60% 45%', origin: '65% 55%', cut: 'mega', ms: 800 },
  { src: xray, position: '40% 50%', origin: '40% 45%', cut: 'punch', ms: 650 },
  { src: flight, position: '40% 45%', origin: '35% 45%', cut: 'swipe', ms: 650 },
  { src: dam, position: '35% 35%', origin: '35% 30%', cut: 'shake', ms: 700 },
  { src: moon, position: '48% 35%', origin: '48% 30%', cut: 'drift', ms: 1800 },
  { src: chip, position: '50% 50%', origin: '50% 50%', cut: 'mega', ms: 650 },
  { src: hubble, position: '50% 50%', origin: '50% 50%', cut: 'hyperspace', ms: 3400 },
  { src: sun, position: '50% 50%', origin: '50% 50%', cut: 'blackhole', ms: 11000 },
];
