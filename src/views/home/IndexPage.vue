<script setup lang="ts">
import CategoryList from "@/components/CategoryList.vue";
import PopularModels from "./components/PopularModels.vue";
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
  console.log('🚀 scrollToBottom called');
  console.log('📏 Current page height before scroll:', document.documentElement.scrollHeight);
  console.log('📏 Current body height before scroll:', document.body.scrollHeight);
  console.log('📍 Current scroll position:', window.scrollY);
  
  // Try with longer delay
  setTimeout(() => {
    console.log('⏰ After 600ms delay:');
    console.log('📏 Page height after delay:', document.documentElement.scrollHeight);
    console.log('📏 Body height after delay:', document.body.scrollHeight);
    console.log('📍 Current scroll position before scroll:', window.scrollY);
    
    // Try multiple scroll methods
    console.log('🔄 Trying window.scrollTo to documentElement.scrollHeight');
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
    
    // Also try scrolling to footer element directly
    if (footerRef.value) {
      console.log('🔄 Also trying scrollIntoView on footer element');
      footerRef.value.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    }
    
    console.log('✅ Scroll commands executed');
    
    // Check if scroll actually happened after a longer delay
    setTimeout(() => {
      console.log('📍 Final scroll position after scroll:', window.scrollY);
      console.log('📏 Final page height:', document.documentElement.scrollHeight);
      console.log('📏 Final body height:', document.body.scrollHeight);
    }, 1000);
    
  }, 600); // Increased delay to 600ms
};

const toggleContactDetails = () => {
  console.log('🔄 toggleContactDetails called');
  console.log('📊 showContactDetails before toggle:', showContactDetails.value);
  
  showContactDetails.value = !showContactDetails.value;
  
  console.log('📊 showContactDetails after toggle:', showContactDetails.value);
  
  // Scroll to bottom when expanding contact details
  if (showContactDetails.value) {
    console.log('✅ Expanding contact details - calling scrollToBottom');
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
