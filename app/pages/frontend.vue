<script setup lang="ts">
import GroupStatsDetail from '@/components/GroupStatsDetail.vue'

definePageMeta({ layout: 'default' })

const { load } = useStatsData()
onMounted(load)
</script>

<template>
  <GroupStatsDetail
    group-key="frontend"
    title="Frontend"
    description="Статистика по направлению Frontend. 0 баллов не учитываются."
  />
</template>
