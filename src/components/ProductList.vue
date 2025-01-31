<script lang="ts" setup>
import type { Product, ProductFilter } from '@/types/dto/product'
import { ref, reactive, watch, nextTick } from 'vue'
import { getProductListService } from '@/services/carshenas/product'
import CurrencyDisplay from './CurrencyDisplay.vue'
import ImageLoader from './ImageLoader.vue'
import type { Nullable } from '@/types/utilities'

const props = defineProps<{
  loading?: boolean
  filter?: ProductFilter
  hasCounter?: boolean
  noPagination?: boolean
  limit?: number
}>()
const count = ref<Nullable<number>>(null)
const products = ref<Product[]>([])
const pagination = reactive<{
  limit: number
  offset: number
}>({ limit: props.limit || 10, offset: 0 })

const getProducts = async ({
  done
}: {
  done: (status: 'ok' | 'error' | 'empty' | 'loading') => void
}) => {
  if (
    (count.value !== null && products.value.length >= count.value) ||
    (props.noPagination && products.value.length)
  )
    return done('empty')

  try {
    const response = await getProductListService({
      ...props.filter,
      ...pagination
    })
    products.value = products.value.concat(response.data.result)

    pagination.offset += pagination.limit

    count.value = response.data.count

    done('ok')
  } catch (e) {
    console.error(e)
    done('error')
  }
}

const isListVisible = ref(true)

watch(
  () => props.filter,
  async () => {
    isListVisible.value = false
    count.value = null
    products.value = []
    await nextTick()
    isListVisible.value = true
  }
)
</script>

<template>
  <v-infinite-scroll v-if="isListVisible" @load="getProducts">
    <template v-for="product in products" :key="product.id">
      <div class="product py-2 px-4">
        <v-row>
          <v-col cols="4" class="d-flex align-center">
            <ImageLoader
              :src="
                product.images && product.images.length > 0
                  ? product.images[0]
                  : product.image || 'placeholder.jpg'
              "
              :alt="product.name!"
              width="86"
              height="86"
              aspectRatio="1"
            />
          </v-col>

          <v-col cols="8" class="d-flex flex-column">
            <div class="d-flex justify-space-between align-center">
              <h2 class="title-sm">{{ product.name }}</h2>

              <!-- <v-btn
                v-if="props.hasCounter && getCartQuantity(product.id) > 0"
                density="compact"
                icon="delete"
                variant="plain"
                class="px-0"
              /> -->
            </div>

            <p class="body-sm mt-2 text-outline">{{ product.description }}</p>

            <div
              class="mt-2 flex-grow-1 d-flex justify-space-between align-end"
            >
              <CurrencyDisplay
                :value="product.price"
                value-class="text-primary font-weight-bold"
                unit-class="body-sm text-outline"
                class="d-flex justify-end body-md py-1"
              />

              <!-- <ItemCounter
                v-if="props.hasCounter && getCartVariant(product.id)"
                :variant="getCartVariant(product.id)!"
                :quantity="getCartQuantity(product.id)"
                @update:quantity="
                  (quantity: number) => handleItemCounter(product, quantity)
                "
              /> -->

              <!-- v-else -->
              <v-btn
                :text="$t('shared.more')"
                variant="plain"
                class="px-0"
                append-icon="chevron_left"
                density="compact"
                :to="{
                  name: 'ProductDetailPage',
                  params: { id: product.id }
                }"
              />
            </div>
          </v-col>
        </v-row>
      </div>
    </template>

    <template #loading>
      <v-skeleton-loader
        v-for="n in 4"
        :key="n"
        class="mt-2"
        height="100"
        type="ossein"
      />
    </template>

    <template #empty>
      <!-- To prevent extra scrollbar from appearing   -->
      <div style="height: 24px"></div>
    </template>
  </v-infinite-scroll>
</template>

<style scoped>
.centered-input {
  width: 120px;
}
</style>
