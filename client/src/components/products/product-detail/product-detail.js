import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { productsData } from '../../../data/productsData';

export default {
  name: 'ProductDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const expandedModule = ref(null);

    const product = computed(() => {
      return productsData.find(p => p.id === route.params.productId);
    });

    function goBack() {
      router.push('/products');
    }

    function toggleModule(moduleId) {
      expandedModule.value = expandedModule.value === moduleId ? null : moduleId;
    }

    function askQuestion(question) {
      router.push({
        path: `/products/${route.params.productId}/question`,
        query: { 
          q: question.query, 
          title: question.title 
        }
      });
    }

    return {
      product,
      expandedModule,
      goBack,
      toggleModule,
      askQuestion
    };
  }
};
