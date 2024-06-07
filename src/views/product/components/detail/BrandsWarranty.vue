<script lang="ts" setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
import CurrencyDisplay from '@/components/CurrencyDisplay.vue'
import type { Brand, Variant, Warranty } from '@/types/dto/product'

const emit = defineEmits(['updateWarranty'])

const props = defineProps<{
  variants: Variant[]
  selectedColorCode: string | null
}>()

const brands = computed<Brand[]>(() => {
  const brandMap: Record<string, Brand> = {}

  props.variants.forEach((variant: Variant) => {
    if (!brandMap[variant.brand]) {
      brandMap[variant.brand] = { name: variant.brand, warranties: [] }
    }

    const brand = brandMap[variant.brand]

    const existingWarranty = brand.warranties.find((warranty) => warranty.name === variant.warranty)
    if (!existingWarranty) {
      brand.warranties.push({
        name: variant.warranty,
        price: variant.price,
        color: variant.color
      })
    }
  })

  return Object.values(brandMap)
})

const selectedBrandName = ref<string | null>(null)
const showBottomSheet = ref(false)
const selectedWarrantyName = ref<string | null>(null)

const selectedBrand = computed(() => {
  return brands.value.find((brand) => brand.name === selectedBrandName.value) || null
})

const selectedBrandTitle = computed(() => {
  return selectedBrand.value ? selectedBrand.value.name : ''
})

const selectedBrandWarranties = computed(() => {
  return selectedBrand.value ? selectedBrand.value.warranties : []
})

function showWarrantyList() {
  const warranties = selectedBrandWarranties.value
  if (warranties.length > 1) {
    showBottomSheet.value = true
  } else if (warranties.length === 1) {
    selectedWarrantyName.value = warranties[0].name
    confirmWarrantySelection()
  }
}

function emitWarranty(warranty: Warranty, brand: Brand) {
  emit('updateWarranty', { warranty, brand })
}

function selectBrand(name: string) {
  selectedBrandName.value = name
  selectedWarrantyName.value = null
  showWarrantyList()
  if (selectedBrandWarranties.value.length === 1) {
    selectedWarrantyName.value = selectedBrandWarranties.value[0].name
    if (selectedBrand.value) {
      emitWarranty(selectedBrandWarranties.value[0], selectedBrand.value)
    }
  }
}

function confirmWarrantySelection() {
  if (selectedWarrantyName.value) {
    const selectedWarranty = selectedBrandWarranties.value.find(
      (warranty) => warranty.name === selectedWarrantyName.value
    )
    if (selectedWarranty) {
      const selectedBrandValue = selectedBrand.value
      if (selectedBrandValue) {
        emitWarranty(selectedWarranty, selectedBrandValue)
        showBottomSheet.value = false
      }
    }
  }
}

watch(
  () => props.selectedColorCode,
  (newColorCode) => {
    if (selectedWarrantyName.value) {
      const selectedWarranty = selectedBrandWarranties.value.find(
        (warranty) => warranty.name === selectedWarrantyName.value
      )
      if (selectedWarranty && selectedWarranty.color.code !== newColorCode) {
        selectedWarrantyName.value = null
        selectedBrandName.value = null
      }
    }
  }
)

function handleBottomSheetClose() {
  if (!selectedWarrantyName.value) {
    selectedBrandName.value = null
  }
}

function hasSelectedColor(brand: Brand): boolean {
  if (!props.selectedColorCode) {
    return true
  }
  return brand.warranties.some((warranty) => warranty.color.code === props.selectedColorCode)
}

function hasWarrantySelectedColor(warranty: Warranty): boolean {
  if (!props.selectedColorCode) {
    return true
  }
  return warranty.color.code === props.selectedColorCode
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
          :key="brand.name"
          class="d-flex flex-column w-100 my-2"
          @click="selectBrand(brand.name)"
          variant="tonal"
          :color="selectedBrandName === brand.name ? 'primary' : 'grey-darken-2'"
          :style="{ opacity: hasSelectedColor(brand) ? 1 : 0.3 }"
        >
          <v-card-text>
            <div class="font-weight-bold">{{ brand.name }}</div>
            <div
              v-if="selectedBrandName === brand.name && selectedWarrantyName"
              class="text-caption font-weight-thin"
            >
              <span class="">{{ selectedWarrantyName }}</span>
              <v-icon icon="edit" class="mr-4" size="18"></v-icon>
            </div>
            <div
              v-else-if="selectedBrandName === brand.name && selectedBrandWarranties.length === 1"
            >
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
                :style="{ opacity: hasWarrantySelectedColor(warranty) ? 1 : 0.3 }"
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
