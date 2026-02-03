<script setup lang="ts">
import GroupStatsDetail from '@/components/GroupStatsDetail.vue'

definePageMeta({ layout: 'default' })

const { load } = useStatsData()
onMounted(load)
</script>

<template>
  <GroupStatsDetail
    group-key="ios"
    title="Mobile — iOS"
    description="Статистика по направлению Mobile - iOS. 0 баллов не учитываются."
  />
</template>
