import {Stack} from "expo-router";
import {AuthProvider} from "@/context/AuthContext";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/queryClient";
import {StatusBar, View} from "react-native";
import useTheme from "@/hooks/useTheme";
import Toast from "react-native-toast-message";
import {toastConfig} from "@/lib/toastConfig";

export default function RootLayout() {
    const colors = useTheme();
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <View style={{flex: 1, backgroundColor: colors.background}}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            animation: 'fade',
                            contentStyle: {backgroundColor: colors.background},
                        }}
                    />
                    <StatusBar
                        translucent
                        backgroundColor="transparent"
                        barStyle="light-content"
                    />
                    <Toast config={toastConfig}/>
                </View>
            </AuthProvider>
        </QueryClientProvider>
    );
}
