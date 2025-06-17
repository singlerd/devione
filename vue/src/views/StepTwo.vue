<template>
    <div class="component pt5 pb5">
        <div class="heading-wrapper">
            <h2>Converted Amount</h2>
        </div>
        <div class="result-wrapper">
            <label for="convertedAmount">Converted</label>
            <input id="convertedAmount" type="number" disabled :value="paymentData.converted" />
        </div>
        <button @click="goToSuccess">Confirm & Pay</button>
    </div>
</template>

<script setup>
    import { inject, onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    const paymentData = inject('paymentData')
    const router = useRouter()

    onMounted (async () => {
        const response = await fetch(`https://drupal.ddev.site/custom-payment/api?currency=${paymentData.currency}&amount=${paymentData.amount}`)
        const result = await response.json()
        paymentData.converted = Number(result.converted_amount).toFixed(2)
        paymentData.original = result.original_amount
    })

    const goToSuccess = () => {
        router.push('/success')
    }
</script>