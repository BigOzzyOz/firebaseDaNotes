import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(provideFirebaseApp(() => initializeApp({
      "projectId":"danotes-60c60",
      "appId":"1:493811640365:web:1c80e1288eba87752370a4",
      "storageBucket":"danotes-60c60.appspot.com",
      "apiKey":"AIzaSyDnia5yE0ScfsiJJ254Ttkrw4gAgMEESSs",
      "authDomain":"danotes-60c60.firebaseapp.com",
      "messagingSenderId":"493811640365"
    }))),
    importProvidersFrom(provideFirestore(() => getFirestore()))]
};
