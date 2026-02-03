<script lang="ts">
export const iframeHeight = "800px"
export const description = "Статистика по направлениям из data.csv (без учёта 0 баллов)."
</script>

<script setup lang="ts">
import SectionCards from '@/components/SectionCards.vue'
import StatsByDirection from '@/components/StatsByDirection.vue'

definePageMeta({ layout: 'default' })

const { load } = useStatsData()
onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-4 md:gap-6 w-full">
    <SectionCards />
    <StatsByDirection />
  </div>
</template>
