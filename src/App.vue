<script setup lang="ts">
import { RouterView } from 'vue-router'

import Header from '@/components/ui/Header/Header.vue'
import Footer from '@/components/ui/Footer/Footer.vue'
import NotificationList from '@/components/ui/NotificationList/NotificationList.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header></Header>
    <main class="flex-grow">
      <RouterView />
    </main>
    <NotificationList />
    <Footer></Footer>
  </div>
</template>

<style scoped></style>
