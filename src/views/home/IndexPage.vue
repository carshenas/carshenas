<script setup lang="ts">
import CategoryList from "@/components/CategoryList.vue";
import PopularModels from "./components/PopularModels.vue";
import { onMounted, ref } from "vue";
import { getMostViewedCategoriesService } from "@/services/carshenas/category";
import type { Category } from "@/types/dto/category";
import BrandFilterBottomSheet from '@/views/product/list/components/BrandFilterBottomSheet.vue'

const items = ref<Category[]>();
const loading = ref<boolean>();
const showContactDetails = ref(false);

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

const toggleContactDetails = () => {
  showContactDetails.value = !showContactDetails.value;
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
    
    <footer class="footer-container">
      <div class="d-flex justify-space-between align-center pa-4">
        <a class="pa-1  bg-red-lighten-5" referrerpolicy='origin' target='_blank'
          href='https://trustseal.enamad.ir/?id=555064&Code=pT1dFV6M7cdFAecFPZ5vJ6oReSgSeV64'>
          <img referrerpolicy='origin'
            src='https://trustseal.enamad.ir/logo.aspx?id=555064&Code=pT1dFV6M7cdFAecFPZ5vJ6oReSgSeV64' alt='eNamad'
            style='cursor:pointer' code='pT1dFV6M7cdFAecFPZ5vJ6oReSgSeV64' height="40">
        </a>
        
        <v-btn variant="text" color="primary" @click="toggleContactDetails" class="contact-btn">
          {{ showContactDetails ? $t("shared.hideContact") : $t("shared.contactUs") }}
        </v-btn>
      </div>
      
      <v-expand-transition>
        <div v-if="showContactDetails" class="contact-details text-right pa-4">
          <div class="contact-item">
            <strong>{{ $t("contactUs.emailLabel") }}:</strong>
            <a href="mailto:carshenas.shop@gmail.com">carshenas.shop@gmail.com</a>
          </div>
          
          <div class="contact-item">
            <strong>{{ $t("contactUs.phoneLabel") }}:</strong>
            <a href="tel:09358766744">09358766744</a>
          </div>
          
          <div class="contact-item">
            <strong>{{ $t("contactUs.phoneLabel") }}:</strong>
            <a href="tel:02133907543">33907543-021</a>
          </div>
          
          <div class="contact-item">
            <strong>{{ $t("contactUs.addressLabel") }}:</strong>
            <span>خیابان امیر کبیر پاساژ کاشانی پلاک 107</span>
          </div>
          
          <div class="contact-item">
            <strong>تلگرام:</strong>
            <a href="https://t.me/CarshenasShopBot">@CarshenasShopBot</a>
          </div>
        </div>
      </v-expand-transition>
    </footer>
    
    <BrandFilterBottomSheet />
  </div>
</template>

<style scoped>
.footer-container {
  background-color: #f5f5f5;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin-top: 12px;
  width: 100%;
}

.contact-details {
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
}

.contact-item {
  margin: 8px 0;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.contact-item strong {
  margin-left: 4px;
}

.contact-btn {
  font-size: 14px;
  margin-left: 2rem;
}
</style>
