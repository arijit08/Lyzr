import {ref} from "vue";

const authToken = ref(localStorage.getItem('auth_token') || null);