import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { getRedirectResult } from 'firebase/auth';
import { auth } from './services/firebase';

/**
 * Ini penting untuk Firebase Google Login redirect.
 */
if (Capacitor.isNativePlatform()) {
  CapApp.addListener('appUrlOpen', async ({ url }) => {
    console.log('APP URL OPEN:', url);

    try {
      // Ini akan menyelesaikan proses redirect login jika ada
      await getRedirectResult(auth);
    } catch (e) {
      console.error('Redirect error', e);
    }

    // Kembalikan ke root app (hindari nyangkut di handler page)
    window.location.replace('/');
  });
} else {
  // FIX: iOS PWA Loop "Restoring Identity"
  // iOS PWA menggunakan redirect flow. Saat page reload, kita harus ambil result-nya.
  // Tanpa ini, Firebase tidak akan men-trigger onAuthStateChanged dengan user baru.
  getRedirectResult(auth).catch((e) => {
    console.debug("PWA Redirect Check:", e);
  });
}

/**
 * ✅ Service Worker untuk PWA
 * ❗ Jangan aktifkan SW di Capacitor (native webview), biar tidak intercept request/login.
 */
if (!Capacitor.isNativePlatform() && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW Registered:', registration.scope);
      })
      .catch((error) => {
        console.error('SW Registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);