import 'dotenv/config';

export default {
  expo: {
    name: 'HabitXP',
    slug: 'habitxp',
    owner: 'diyarhas001',
    icon: './assets/images/app-logo.png',
    splash: {
      image: './assets/images/app-logo.png',
      resizeMode: 'contain',
      backgroundColor: '#0C0A12',
    },
    scheme: 'habitxp',
    android: {
      package: 'com.Diyar.habitxp',
    },
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: 'b9a29f70-199f-4600-b51b-3eb848c606e9',
      },
    },
    plugins: ['expo-secure-store'],
  },
};
