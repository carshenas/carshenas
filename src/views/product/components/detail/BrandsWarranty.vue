<script lang="ts" setup>
import { ref, computed, defineProps, watch, defineEmits } from 'vue'
import CurrencyDisplay from '@/components/CurrencyDisplay.vue'

const emit = defineEmits(['updateWarrantyPrice'])
const props = defineProps<{
  brands: {
    id: number
    title: string
    warranties: { name: string; price: number }[]
  }[]
}>()

const selectedBrandId = ref<number | null>(null)
const showBottomSheet = ref(false)
const selectedWarrantyName = ref<string | null>(null)

const selectedBrand = computed(() => {
  return props.brands.find((brand) => brand.id === selectedBrandId.value) || null
})

const selectedBrandTitle = computed(() => {
  return selectedBrand.value ? selectedBrand.value.title : ''
})

const selectedBrandWarranties = computed(() => {
  return selectedBrand.value ? selectedBrand.value.warranties : []
})

function showWarrantyList() {
  const warranties = selectedBrandWarranties.value
  if (warranties.length > 1) {
    showBottomSheet.value = true
  } else if (warranties.length === 1) {
    // Automatically select the only warranty if there's only one
    selectedWarrantyName.value = warranties[0].name
    confirmWarrantySelection()
  }
}

function emitWarrantyPrice(price: number) {
  emit('updateWarrantyPrice', price)
}

function selectBrand(id: number) {
  selectedBrandId.value = id
  selectedWarrantyName.value = null
  showWarrantyList()
  if (selectedBrandWarranties.value.length === 1) {
    selectedWarrantyName.value = selectedBrandWarranties.value[0].name
    emitWarrantyPrice(selectedBrandWarranties.value[0].price)
  }
}

function confirmWarrantySelection() {
  if (selectedWarrantyName.value) {
    const selectedWarranty = selectedBrandWarranties.value.find(
      (warranty) => warranty.name === selectedWarrantyName.value
    )
    if (selectedWarranty) {
      emitWarrantyPrice(selectedWarranty.price)
      showBottomSheet.value = false
    }
  }
}

function handleBottomSheetClose() {
  if (!selectedWarrantyName.value) {
    selectedBrandId.value = null
  }
}

watch(showBottomSheet, (newVal) => {
  if (!newVal) {
    handleBottomSheetClose()
  }
})
</script>

<template>
  <div class="d-flex flex-column t-4 px-4 ga-8">
    <div class="d-flex align-center">
      <h4 role="heading">{{ $t('productDetail.brands') }}</h4>
      <div class="w-100 border h-0 mx-2"></div>
    </div>

    <v-container>
      <div class="d-flex flex-wrap">
        <v-card
          v-for="brand in brands"
          :key="brand.id"
          class="d-flex flex-column w-100 my-2"
          @click="selectBrand(brand.id)"
          variant="tonal"
          :color="selectedBrandId === brand.id ? 'primary' : 'grey-darken-2'"
        >
          <v-card-text>
            <div class="font-weight-bold">{{ brand.title }}</div>
            <div
              v-if="selectedBrandId === brand.id && selectedWarrantyName"
              class="text-caption font-weight-thin"
            >
              <span class="">{{ selectedWarrantyName }}</span>
              <v-icon icon="edit" class="mr-4" size="18"></v-icon>
            </div>
            <div v-else-if="selectedBrandId === brand.id && selectedBrandWarranties.length === 1">
              <span>{{ selectedBrandWarranties[0].name }}</span>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <v-bottom-sheet v-model="showBottomSheet">
        <v-card>
          <v-card-title>{{ selectedBrandTitle }}</v-card-title>
          <v-card-text>
            <v-radio-group v-model="selectedWarrantyName" dir="rtl">
              <v-radio
                class="d-flex justify-space-between warranty-radio"
                v-for="warranty in selectedBrandWarranties"
                :key="warranty.name"
                :value="warranty.name"
                color="primary"
              >
                <template v-slot:label>
                  <div class="d-flex justify-space-between w-100 warranty-child" dir="rtl">
                    <span>{{ warranty.name }}</span>
                    <CurrencyDisplay
                      :value="warranty.price"
                      value-class="text-primary font-weight-bold"
                    />
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="flat" size="large" block @click="confirmWarrantySelection">تایید</v-btn>
          </v-card-actions>
        </v-card>
      </v-bottom-sheet>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.selected-card {
  border-color: var(--v-primary-base);
  background-color: var(--v-primary-lighten5);
}
.warranty-radio label {
  flex-grow: 1 !important;
}
.warranty-child {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
}
</style>
