<template>
    <div class="component pt5 pb5">
        <div class="heading-wrapper center">
            <h2>Payment Successful</h2>
        </div>
        <div class="confirmation-wrapper center pb5">
            <p>Payment successful for <span class="bold">{{ paymentData.converted }}</span> amount in <span class="bold">{{ paymentData.currency }}</span></p>
        </div>
    </div>
  </template>

<script setup>
    import { inject } from 'vue'
    const paymentData = inject('paymentData')
</script>