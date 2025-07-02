import "dotenv/config";

export default {
    expo: {
        name: "HabitXP",
        slug: "habitxp",
        icon: "./assets/images/app-logo.png",
        splash: {
            image: "./assets/images/app-logo.png",
            resizeMode: "contain",
            backgroundColor: "#0C0A12"
        },
        scheme: "habitxp",
        android: {
            package: "com.Yassine.habitxp"
        },
        extra: {
            API_URL: process.env.API_URL,
            eas: {
                projectId: "5621b295-73ae-4952-9b5e-79f109e7a29d"
            }
        },
        plugins: [
            "expo-secure-store",
        ]
    },
};