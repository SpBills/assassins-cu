import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
const firebaseConfig = {
    apiKey: "AIzaSyA-Fmk2yNWwjXhWMtlxZryNqdZFPWHnj2w",
    authDomain: "assassins-cu.firebaseapp.com",
    projectId: "assassins-cu",
    storageBucket: "assassins-cu.appspot.com",
    messagingSenderId: "15265011308",
    appId: "1:15265011308:web:b5e8bc3d921f3a8d72aa49",
    measurementId: "G-NL0H67JG6P"
};

// Initialize Firebase
initializeApp(firebaseConfig);

createApp(App).use(router).mount('#app')
