import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TimerProvider from "./context/TimerContext";

// This will prevent the splash screen from auto hiding until loading all the font assets.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, error] = useFonts({
            "Roboto-Mono": require("../assets/fonts/RobotoMono-Regular.ttf"),
        });    
    

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) SplashScreen.hideAsync();      // to hide splashscreen if fonts have loaded
    }, [fontsLoaded, error]);

    if (!fontsLoaded) return null;
    if (!fontsLoaded && !error) return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TimerProvider>
        <Stack>
            <Stack.Screen name='(tabs)' options={{headerShown: false}} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="meditate/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="(modal)/adjustMeditationDuration" options={{headerShown: false, presentation:"modal"}}/>
                </Stack>
                </TimerProvider>
        </GestureHandlerRootView>
    )
}