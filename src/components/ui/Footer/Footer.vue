<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <footer class="bg-primary text-white">
    <div class="container mx-auto py-6 px-4">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- Left section -->
        <div class="text-center md:text-left">
          <h2 class="text-xl font-bold">Taskman</h2>
          <p class="mt-2 text-sm">A simple task management app</p>
        </div>
        <!-- Right section -->
        <!-- <div class="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0">
          <RouterLink class="text-white hover:text-yellow-400" to="/">Home</RouterLink>
          <RouterLink class="text-white hover:text-yellow-400" to="/tasks">Tasks</RouterLink>
          <RouterLink class="text-white hover:text-yellow-400" to="/settings">Settings</RouterLink>
        </div> -->
      </div>
      <!-- Divider -->
      <div class="border-t border-gray-300 my-4"></div>
      <!-- Copyright section -->
      <div class="text-center">
        <p class="text-xs">
          {{ `&#169; ${new Date().getFullYear()} CodingWithHao. All rights reserved.` }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>
