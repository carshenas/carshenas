<script setup lang="ts">
import CategoryList from "@/components/CategoryList.vue";
import PopularModels from "./components/PopularModels.vue";
// import BlogPost from "./components/PostsList.vue";
import { onMounted, ref } from "vue";
import { getMostViewedCategoriesService } from "@/services/carshenas/category";
import type { Category } from "@/types/dto/category";

const items = ref<Category[]>();
const loading = ref<boolean>();

const getMostViewedCategories = async () => {
  loading.value = true;
  try {
    const response = await getMostViewedCategoriesService();

    items.value = response.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};



onMounted(() => getMostViewedCategories());
</script>

<template>

  <div class="pa-4 pb-0 d-flex flex-column h-100 justify-space-between">
    <div>
      <header>
        <h1 class="headline-sm">
          {{ $t("home.headline") }}
        </h1>

        <p class="mt-2 body-md">
          {{ $t("home.description") }}
        </p>

        <v-btn :text="$t('shared.search')" variant="outlined" color="outline" rounded="pill" size="large"
          class="d-flex justify-space-between mt-6 mb-12" append-icon="search" to="/search" block />
      </header>

      <section class="my-12">
        <h2 class="title-sm">
          {{ $t("home.popularModels") }}
        </h2>

        <PopularModels />
      </section>

      <section class="my-12">
        <h2 class="title-sm">
          {{ $t("home.popularCatagories") }}
        </h2>

        <CategoryList :items :loading manual class="mt-4" />
      </section>
    </div>
    <footer class="mt-12 pt-6 pb-6 px-4 ">
      <a class="pa-1 bg-red-lighten-5" referrerpolicy='origin' target='_blank'
        href='https://trustseal.enamad.ir/?id=555064&Code=pT1dFV6M7cdFAecFPZ5vJ6oReSgSeV64'><img referrerpolicy='origin'
          src='https://trustseal.enamad.ir/logo.aspx?id=555064&Code=pT1dFV6M7cdFAecFPZ5vJ6oReSgSeV64' alt=''
          style='cursor:pointer' code='pT1dFV6M7cdFAecFPZ5vJ6oReSgSeV64'></a>
    </footer>
    <!-- <section class="my-12">
      <div class="d-flex justify-space-between align-center">
        <h2 class="title-sm">
          {{ $t("home.carMagazine") }}
        </h2>

        <v-btn variant="text">
          {{ $t("shared.viewAll") }}
        </v-btn>
      </div>

      <BlogPost />
    </section> -->
  </div>

</template>
<style scoped>
footer {
  background-color: #f5f5f5;
  font-size: 14px;
}
</style>