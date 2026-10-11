import { ProductItemType } from './types/ProductItemType';
import { Product } from './types/Product';

// Login still expects a server. The public catalog reads local JSON.
export const API_URL = 'https://test-api-server-hetv.onrender.com';

function assetUrl(path: string) {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

  return `${base}/${path}`;
}

let productsPromise: Promise<Product[]> | null = null;
let detailsPromise: Promise<ProductItemType[]> | null = null;

function loadProducts() {
  if (!productsPromise) {
    productsPromise = fetch(assetUrl('api/products.json')).then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      return response.json();
    });
  }

  return productsPromise;
}

function loadDetails() {
  if (!detailsPromise) {
    detailsPromise = Promise.all(
      ['phones.json', 'tablets.json', 'accessories.json'].map(file =>
        fetch(assetUrl(`api/${file}`)).then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch ${file}`);
          }

          return response.json() as Promise<ProductItemType[]>;
        }),
      ),
    ).then(lists => lists.flat());
  }

  return detailsPromise;
}

function sortByField(products: Product[], sortBy: string) {
  const sorted = [...products];

  if (sortBy === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'price') {
    sorted.sort((a, b) => a.price - b.price);
  } else {
    sorted.sort((a, b) => b.year - a.year);
  }

  return sorted;
}

export function getProducts(): Promise<Product[]> {
  return loadProducts();
}

export async function getOneProduct(id: string): Promise<ProductItemType> {
  const details = await loadDetails();
  const product = details.find(item => item.id === id);

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
}

export async function getRecommendedProducts(id: string): Promise<Product[]> {
  const details = await loadDetails();
  const current = details.find(item => item.id === id);

  if (!current) {
    return [];
  }

  const products = await loadProducts();

  return products
    .filter(product => (
      product.category === current.category && product.itemId !== id
    ))
    .slice(0, 10);
}

export async function getProductsByCategory(
  category: string,
  sortBy = 'year',
  perPage: string,
  page = 1,
): Promise<{ products: Product[]; totalCount: number; totalPages: number }> {
  const products = await loadProducts();
  const sorted = sortByField(
    products.filter(product => product.category === category),
    sortBy,
  );
  const totalCount = sorted.length;
  const parsedPerPage = Number(perPage);
  const itemsOnPage = parsedPerPage > 0 ? parsedPerPage : totalCount || 1;
  const totalPages = Math.ceil(totalCount / itemsOnPage) || 1;
  const start = itemsOnPage * (page - 1);

  return {
    products: sorted.slice(start, start + itemsOnPage),
    totalCount,
    totalPages,
  };
}

export async function getNewestProducts(): Promise<Product[]> {
  const products = await loadProducts();

  return [...products].sort((a, b) => b.year - a.year).slice(0, 10);
}

export async function getHotPricesProducts(): Promise<Product[]> {
  const products = await loadProducts();

  return [...products]
    .sort((a, b) => (b.fullPrice - b.price) - (a.fullPrice - a.price))
    .slice(0, 10);
}
