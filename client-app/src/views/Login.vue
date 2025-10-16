<script setup lang="ts">

import {useRouter} from "vue-router";
import {ref} from "vue";
import {EDIT_WORKFLOW_PATH, LOGIN_PATH, SERVER_ADDRESS} from "../config";
import '../styles.css';

const router = useRouter();

// Reference values representing UI form inputs
const username = ref('');
const password = ref('');
const logInStatusMsg = ref('');


// Sends user details to the server in order to log them in
async function handleLogin() {
  logInStatusMsg.value = 'Please wait...';

  // POST request to login function
  try {
    const response = await fetch(SERVER_ADDRESS + LOGIN_PATH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Login successful. Save the token
      localStorage.setItem('auth_token', data.token);
      logInStatusMsg.value = 'Login successful. Redirecting...';

      // Redirect to the Create/Edit Workflow page
      router.push(EDIT_WORKFLOW_PATH);
    } else {
      // Server returned failure message
      logInStatusMsg.value = `Login failed: ${data.message}`;
    }
  } catch (error) {
    // Server returned neither of the expected responses
    logInStatusMsg.value = 'Network Error';
    console.error('Login failed:', error);
  }
}

</script>

<template>
<div class="min-h-screen flex flex-col justify-center items-center dark:bg-gray-800">
<div class="w-full max-w-md p-8 bg-gray-700 rounded-lg shadow-lg border-gray:500">
  <h2 class="text-xl font-bold text-white mb-5 text-center">
    Please login to proceed
  </h2>

  <form @submit.prevent="handleLogin" class="space-y-5">
    <input
        type="text"
        v-model="username"
        placeholder="Username"
        required
        class="w-full px-4 py-2 bg-gray-800 text-white placeholder-color-gray-700 border-white rounded-md focus:outline-none focus:ring-blue-500">
    <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
        class="w-full px-4 py-2 bg-gray-800 text-white placeholder-color-gray-700 border-white rounded-md focus:outline-none focus:ring-blue-500">
    <button
        type="submit"
        class="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500">
      LOGIN
    </button>
    <p v-if="logInStatusMsg" class="mt-6 text-sm text-center text-red-400">
      {{logInStatusMsg}}
    </p>
  </form>
</div>
</div>
</template>

<style scoped>

</style>