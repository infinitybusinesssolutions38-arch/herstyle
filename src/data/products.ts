import heroModelImg from '@/assets/hero-model.jpg';
import heroCloseupImg from '@/assets/hero-closeup.jpg';
import editorialBannerImg from '@/assets/editorial-banner.jpg';
import dress1Img from '@/assets/dress-1.jpg';
import dress2Img from '@/assets/dress-2.jpg';
import dress3Img from '@/assets/dress-3.jpg';
import coordSetImg from '@/assets/coord-set.jpg';
import heels1Img from '@/assets/heels-1.jpg';

export { heroModelImg, heroCloseupImg, editorialBannerImg };

import { Product } from '@/context/StoreContext';

export const products: Product[] = [
  {
    id: 1,
    name: 'Floral Meadow Midi Dress',
    price: 4299,
    category: 'Dresses',
    image: dress1Img,
    images: [dress1Img, dress2Img],
    description: 'A dreamy floral midi dress crafted from lightweight crepe. Perfect for afternoon soirées and garden parties.',
    colors: ['Ivory', 'Blush', 'Sage'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 2,
    name: 'Noir Satin Evening Gown',
    price: 7899,
    category: 'Dresses',
    image: dress2Img,
    images: [dress2Img, dress3Img],
    description: 'Timeless black satin evening gown with sweetheart neckline. An icon of understated glamour.',
    colors: ['Black', 'Midnight Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 3,
    name: 'Scarlet Wrap Dress',
    price: 3599,
    category: 'Dresses',
    image: dress3Img,
    images: [dress3Img, dress1Img],
    description: 'A bold scarlet wrap dress that flatters every silhouette. Statement dressing for the modern woman.',
    colors: ['Red', 'Burgundy', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 4,
    name: 'Ivory Linen Co-ord Set',
    price: 5499,
    category: 'Co-ord Sets',
    image: coordSetImg,
    images: [coordSetImg],
    description: 'Relaxed ivory linen blazer and wide-leg trouser set. Effortless sophistication from desk to dinner.',
    colors: ['Ivory', 'Camel', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 5,
    name: 'Rose Gold Party Dress',
    price: 5999,
    category: 'Party Wear',
    image: dress1Img,
    images: [dress1Img, dress3Img],
    description: 'Shimmering rose gold mini dress with ruched detailing. The perfect statement for cocktail parties.',
    colors: ['Rose Gold', 'Silver', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 6,
    name: 'Sequin Midnight Gown',
    price: 8999,
    category: 'Party Wear',
    image: dress2Img,
    images: [dress2Img, dress1Img],
    description: 'A floor-length sequin gown that commands the room. Perfect for galas and special occasions.',
    colors: ['Black', 'Champagne', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    id: 7,
    name: 'Noir Strappy Heels',
    price: 3999,
    category: 'Heels',
    image: heels1Img,
    images: [heels1Img],
    description: 'Sculptural black strappy heels with block heel. Architectural beauty meets wearable comfort.',
    colors: ['Black', 'Nude', 'Red'],
    sizes: ['36', '37', '38', '39', '40', '41'],
  },
  {
    id: 8,
    name: 'Crystal Embellished Pumps',
    price: 4799,
    category: 'Heels',
    image: heels1Img,
    images: [heels1Img],
    description: 'Breathtaking crystal-embellished pointed pumps. Where luxury meets every step.',
    colors: ['Clear', 'Gold', 'Silver'],
    sizes: ['36', '37', '38', '39', '40', '41'],
  },
  {
    id: 9,
    name: 'Pastel Blazer Co-ord',
    price: 6299,
    category: 'Co-ord Sets',
    image: coordSetImg,
    images: [coordSetImg],
    description: 'Soft pastel blazer paired with matching wide-leg trousers. Effortless power dressing.',
    colors: ['Lilac', 'Mint', 'Blush'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
];

export const categories = [
  { name: 'Dresses', icon: '👗' },
  { name: 'Co-ord Sets', icon: '🧥' },
  { name: 'Party Wear', icon: '✨' },
  { name: 'Heels', icon: '👠' },
];
