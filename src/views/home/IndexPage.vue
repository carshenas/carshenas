<script setup lang="ts">
import CategoryList from "@/components/CategoryList.vue";
import PopularModels from "./components/PopularModels.vue";
import BannerCarousel from "@/components/BannerCarousel.vue";
import { onMounted, ref, nextTick } from "vue";
import { getMostViewedCategoriesService } from "@/services/carshenas/category";
import type { Category } from "@/types/dto/category";
import BrandFilterBottomSheet from '@/views/product/list/components/BrandFilterBottomSheet.vue'

const items = ref<Category[]>();
const loading = ref<boolean>();
const showContactDetails = ref(false);
const error = ref<string | null>(null);
const footerRef = ref<HTMLElement>();

const getMostViewedCategories = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getMostViewedCategoriesService();
    items.value = response.data;
  } catch (e) {
    error.value = 'خطا در بارگذاری دسته‌بندی‌ها. لطفا دوباره تلاش کنید.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const scrollToBottom = () => {

  
  setTimeout(() => {

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
    
    // Also try scrolling to footer element directly
    if (footerRef.value) {
      footerRef.value.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    }
    
    
  }, 600); 
};

const toggleContactDetails = () => {
  
  showContactDetails.value = !showContactDetails.value;
  
  
  // Scroll to bottom when expanding contact details
  if (showContactDetails.value) {
    scrollToBottom();
  } else {
    console.log('❌ Collapsing contact details - no scroll');
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

      <!-- Banner Carousel -->
      <BannerCarousel />

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
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <CategoryList :items :loading manual class="mt-4" />
      </section>
    </div>
    
    <footer ref="footerRef" class="footer-container">
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
            <a href="tel:02133907543">021-33907543</a>
          </div>
          
          <div class="contact-item">
            <strong>{{ $t("contactUs.addressLabel") }}:</strong>
            <span>خیابان امیر کبیر پاساژ کاشانی پلاک 107</span>
          </div>
          
          <div class="contact-item">
            <strong>تلگرام:</strong>
            <a href="https://t.me/@Carshenas_support">@Carshenas_support</a>
          </div>
        </div>
      </v-expand-transition>
      
      <!-- Version number for cache identification -->
      <div class="version-info">
        <span class="version-text">1.0.1</span>
      </div>
    </footer>
    
    <BrandFilterBottomSheet />
  </div>
</template>

<style scoped>
.footer-container {
  background-color: var(--v-theme-surface);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  margin-top: 12px;
  width: 100%;
}

.contact-details {
  border-bottom: 1px dashed var(--v-theme-divider);
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

.version-info {
  text-align: center;
  padding: 8px 0;
  border-top: 1px solid var(--v-theme-divider);
  margin-top: 8px;
}

.version-text {
  font-size: 10px;
  color: var(--v-theme-outline);
  font-weight: 300;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.error-message {
  color: #d32f2f;
  background: #fff0f0;
  border: 1px solid #d32f2f;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 16px;
  text-align: center;
  font-size: 15px;
}
</style>
