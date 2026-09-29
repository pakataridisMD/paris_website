import type { Scene } from '../reel';
import papyrus from '@/public/images/reel-medicine/01-papyrus.jpg';
import hippocrates from '@/public/images/reel-medicine/02-hippocrates.jpg';
import avicenna from '@/public/images/reel-medicine/03-avicenna.jpg';
import vesalius from '@/public/images/reel-medicine/04-vesalius.jpg';
import harvey from '@/public/images/reel-medicine/05-harvey.jpg';
import hooke from '@/public/images/reel-medicine/06-hooke.jpg';
import jenner from '@/public/images/reel-medicine/07-jenner.jpg';
import laennec from '@/public/images/reel-medicine/08-laennec.jpg';
import nightingale from '@/public/images/reel-medicine/09-nightingale.jpg';
import pasteur from '@/public/images/reel-medicine/10-pasteur.jpg';
import ecg from '@/public/images/reel-medicine/11-ecg.jpg';
import penicillin from '@/public/images/reel-medicine/12-penicillin.jpg';
import dna from '@/public/images/reel-medicine/13-dna.jpg';
import polio from '@/public/images/reel-medicine/14-polio.jpg';
import mri from '@/public/images/reel-medicine/15-mri.jpg';
import genome from '@/public/images/reel-medicine/16-genome.jpg';
import virus from '@/public/images/reel-medicine/17-virus.jpg';
import neurons from '@/public/images/reel-medicine/18-neurons.jpg';

/* The history of medicine, for the Medicine page. Every frame is public
   domain or CC0, from Wikimedia Commons: Edwin Smith Papyrus (J. Dahl) ·
   P. Pontius after Rubens, Hippocrates, 1638 (NLM) · Ibn Sina, Canon of
   Medicine, 1052 (Aga Khan Museum; Daderot) · Vesalius, De humani corporis
   fabrica, 1543 · Harvey, De motu cordis (NLM) · Hooke, Micrographia (NLM) ·
   W. Skelton for Jenner's Inquiry, 1798 · Laennec stethoscopes (Musée
   d'histoire de la médecine, Lyon; Romainbehar, CC0) · F. Nightingale's
   diagram of the causes of mortality, 1858 · A. Edelfelt, Louis Pasteur, 1885
   · Normal sinus rhythm ECG (Rocuronium Bromide, CC0) · US WWII penicillin
   poster (Science History Institute) · DNA helix (PublicDomainPictures, CC0)
   · Salk vaccine shipment, 1958 (J. van Bilsen / Anefo, Nationaal Archief,
   CC0) · 7 T MRI of the human brain (Edlow et al., MGH, CC0) · Human
   karyotype ideogram (M. Häggström, CC0) · SARS-CoV-2 (CDC / A. Eckert,
   D. Higgins) · Neuronal activity (DARPA; MGH and Draper).

   Paced like the business film: four opening hits, a breath, acceleration,
   quiet moments for Pasteur and the MRI, then a warp into the universe
   within, and a long finale that fades to black. */
export const MEDICINE: Scene[] = [
  { src: papyrus, position: '50% 50%', origin: '50% 50%', cut: 'slam', ms: 1000 },
  { src: hippocrates, position: '35% 40%', origin: '33% 40%', cut: 'punch', ms: 1000 },
  { src: avicenna, position: '50% 50%', origin: '60% 45%', cut: 'shake', ms: 1000 },
  { src: vesalius, position: '55% 35%', origin: '55% 20%', cut: 'slam', ms: 1000 },
  { src: harvey, position: '45% 50%', origin: '45% 50%', cut: 'drift', ms: 1700 },
  { src: hooke, position: '60% 50%', origin: '65% 50%', cut: 'focus', ms: 1400 },
  { src: jenner, position: '40% 50%', origin: '38% 55%', cut: 'mega', ms: 850 },
  { src: laennec, position: '50% 50%', origin: '50% 45%', cut: 'punch', ms: 750 },
  { src: nightingale, position: '62% 50%', origin: '62% 55%', cut: 'swipe', ms: 750 },
  { src: pasteur, position: '50% 35%', origin: '50% 35%', cut: 'focus', ms: 1400 },
  { src: ecg, position: '50% 50%', origin: '50% 55%', cut: 'mega', ms: 800 },
  { src: penicillin, position: '50% 50%', origin: '50% 45%', cut: 'punch', ms: 650 },
  { src: dna, position: '40% 50%', origin: '40% 50%', cut: 'swipe', ms: 650 },
  { src: polio, position: '45% 50%', origin: '40% 55%', cut: 'shake', ms: 700 },
  { src: mri, position: '50% 50%', origin: '50% 50%', cut: 'drift', ms: 1800 },
  { src: genome, position: '30% 50%', origin: '30% 50%', cut: 'mega', ms: 650 },
  { src: virus, position: '50% 50%', origin: '50% 50%', cut: 'warp', ms: 1900 },
  { src: neurons, position: '50% 50%', origin: '50% 50%', cut: 'finale', ms: 7500 },
];
