import { ref } from 'vue';

const previousRoute = ref(null);

export function usePreviousRoute() {
  const setPreviousRoute = (route) => {
    previousRoute.value = route;
  };

  return {
    previousRoute,
    setPreviousRoute,
  };
}