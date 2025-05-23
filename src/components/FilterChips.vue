<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';
import type { ProductFilter } from '@/types/dto/product';
import { useLogger } from '@/composable/useLogger';

const props = defineProps<{
    filter?: ProductFilter
}>();

const logger = useLogger();
const activeFilters = ref<Record<string, any>>({});

const emit = defineEmits<{
    (e: 'remove', key: string): void
}>();

// Watch for filter changes and log them
watch(() => props.filter, (newFilter) => {
    if (!newFilter) {
        activeFilters.value = {};
        logger.info('All filters cleared', { activeFilters: {} });
        return;
    }
    activeFilters.value = {};

    if (newFilter.title && newFilter.title.trim() !== '') {
        activeFilters.value.title = newFilter.title;
    }
    if (newFilter.vehicleName && newFilter.vehicleName.trim() !== '') {
        activeFilters.value.vehicleName = newFilter.vehicleName; // Add vehicle name to active filters
    }

    logger.info('Active product filters updated', {
        activeFilters: { ...activeFilters.value },
        filterCount: Object.keys(activeFilters.value).length,
        timestamp: new Date().toISOString()
    });

}, { immediate: true, deep: true });

onMounted(() => {
    logger.info('ProductFilterLogger mounted', {
        initialFilters: props.filter || {},
        activeFilters: { ...activeFilters.value }
    });
});

const removeFilter = (key: string) => {
    delete activeFilters.value[key];
    emit('remove', key);
    logger.info('Filter removed', { key, remainingFilters: { ...activeFilters.value } });
};

defineExpose({
    getActiveFilters: () => ({ ...activeFilters.value }),
    getFilterCount: () => Object.keys(activeFilters.value).length,
    clearFilters: () => {
        activeFilters.value = {};
        logger.info('Filters manually cleared', { activeFilters: {} });
    }
});
</script>

<template>
    <div class="filter-chips">
        <!-- Render a chip for each active filter -->
        <v-chip
            v-for="(value, key) in activeFilters"
            :key="key"
            class="ma-1"
            color="primary"
            outlined
            closable
            @click:close="removeFilter(key)"
        >
           {{ value }}
        </v-chip>
    </div>
</template>

<style scoped>
.filter-chips {
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    padding: 8px 0;
}
</style>