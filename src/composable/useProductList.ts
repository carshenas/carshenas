  import type { Product, ProductFilter } from "@/types/dto/product";
  import { ref, reactive, watch, nextTick } from "vue";
  import { getProductListService } from "@/services/carshenas/product";
  import type { Nullable } from "@/types/utilities";
  import { useLogger } from "./useLogger";

  export function useProductList(props: {
    loading?: boolean;
    filter?: ProductFilter;
    hasCounter?: boolean;
    noPagination?: boolean;
    limit?: number;
  }) {
    const logger = useLogger();
    const count = ref<Nullable<number>>(null);
    const products = ref<Product[]>([]);
    const pagination = reactive<{
      limit: number;
      offset: number;
    }>({ limit: props.limit || 10, offset: 0 });

    // Track loading state
    const isLoading = ref(false);
    const loadCount = ref(0);
    const lastLoadTime = ref(Date.now());
    const isListVisible = ref(true);

    const getProducts = async ({
      done,
    }: {
      done: (status: "ok" | "error" | "empty" | "loading") => void;
    }) => {
      const functionName = "getProducts";

      // Log the call and detect potential loops
      loadCount.value++;
      lastLoadTime.value = Date.now();



      const isLoopDetected = logger.detectLoop(functionName);
      if (isLoopDetected && isLoading.value) {
        logger.error(`Breaking potential infinite loop in ${functionName}`);
        return done("error");
      }

      // Check if we should load more products
      if (
        (count.value !== null && products.value.length >= count.value) ||
        (props.noPagination && products.value.length)
      ) {
        logger.info("No more products to load.", {
          currentProducts: products.value.length,
          totalCount: count.value,
          noPagination: props.noPagination,
        });
        return done("empty");
      }

      // Prevent concurrent requests
      if (isLoading.value) {
        logger.warn("Already loading products, skipping this request");
        return;
      }

      try {
        isLoading.value = true;
        done("loading");

        const response = await getProductListService({
          ...props.filter,
          ...pagination,
        });

        products.value = products.value.concat(response.data.result);
        pagination.offset += pagination.limit;
        count.value = response.data.count;


        isLoading.value = false;
        done("ok");
      } catch (e) {
        logger.error("Error fetching products:", e);
        isLoading.value = false;
        done("error");
      }
    };

    // Track filter changes
    watch(
      () => props.filter,
      (newFilter, oldFilter) => {
        logger.info("Filter changed", {
          oldFilter,
          newFilter,
        });

        resetList();
      },
      { deep: true }
    );

    // Reset list when needed
    const resetList = async () => {
      logger.info("Resetting product list");
      isListVisible.value = false;
      count.value = null;
      products.value = [];
      pagination.offset = 0;
      loadCount.value = 0;

      await nextTick();
      isListVisible.value = true;
    };

    // Monitor scroll events to detect potential issues
    const scrollCounter = ref(0);
    const lastScrollTime = ref(Date.now());

    const handleScroll = () => {
      scrollCounter.value++;
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime.value;

      if (timeSinceLastScroll < 50 && scrollCounter.value % 10 === 0) {
        logger.warn(
          `Rapid scrolling detected: ${scrollCounter.value} events in ${now - lastScrollTime.value}ms`
        );
      }

      lastScrollTime.value = now;
    };

    // Debugging utilities
    const debugLogs = {
      export: () => logger.exportLogs(),
      clear: () => logger.clearLogs(),
      get: () => logger.getLogs(),
    };

    return {
      count,
      products,
      isLoading,
      isListVisible,
      getProducts,
      resetList,
      handleScroll,
      debugLogs,
    };
  }
