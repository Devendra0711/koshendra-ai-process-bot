import { useRouter } from 'vue-router';
import { productsData } from '../data/productsData';

export default {
  name: 'ProductsView',
  setup() {
    const router = useRouter();

    function goToProduct(productId) {
      router.push(`/products/${productId}`);
    }

    return {
      products: productsData,
      goToProduct
    };
  }
};
