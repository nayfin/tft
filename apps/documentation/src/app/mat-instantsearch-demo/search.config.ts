import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'B1G2GM9NG0',
  'aadef574be1f9252bb48d4ea09b5cfe5'
);

export const SEARCH_CONFIG = {
  indexName: 'demo_ecommerce',
  searchClient
};
