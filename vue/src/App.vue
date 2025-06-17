<template>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">

  <main> 
    <router-view />
  </main>
</template>

<script setup>
  import { reactive, provide } from "vue";

  const paymentData = reactive({
    currency: '',
    amount: 0,
    converted: 0,
    original: 0
  })

  provide('paymentData', paymentData)
</script>