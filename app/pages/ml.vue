<script setup lang="ts">
import GroupStatsDetail from '@/components/GroupStatsDetail.vue'

definePageMeta({ layout: 'default' })

const { load } = useStatsData()
onMounted(load)
</script>

<template>
  <GroupStatsDetail
    group-key="ml"
    title="ML"
    description="Статистика по направлению Machine Learning. 0 баллов не учитываются."
  />
</template>
