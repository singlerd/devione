<template>
    <div class="component pt5 pb5">
       <div class="heading-wrapper">
        <h2>Select Currency & Amount</h2>
       </div>
        
        <label for="currency">Currency</label>
        <select id="currency" v-model="paymentData.currency"> 
            <option selected value="">-- Select Currency --</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
        </select>
    
        <label for="amount">Amount</label>
        <input id="amount" type="number" v-model="paymentData.amount" placeholder="Enter Amount" />
    
        <button @click="goToStepTwo"> Get Rate </button>
    </div>
</template>

<script setup>
    import { inject } from 'vue';
    import { useRouter } from 'vue-router'
    
    const paymentData = inject('paymentData')
    const router = useRouter()

    const goToStepTwo = () => {
        if (paymentData.currency && paymentData.amount > 0) {
            router.push('/confirm');
        } else {
            alert('Please select currency and enter amount.')
        }
    }

</script>
