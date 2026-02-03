<script setup lang="ts">
import GroupStatsDetail from '@/components/GroupStatsDetail.vue'

definePageMeta({ layout: 'default' })

const { load } = useStatsData()
onMounted(load)
</script>

<template>
  <GroupStatsDetail
    group-key="android"
    title="Mobile — Android"
    description="Статистика по направлению Mobile - Android. 0 баллов не учитываются."
  />
</template>
