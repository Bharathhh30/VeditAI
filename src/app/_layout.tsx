import {
  ClerkLoaded,
  ClerkProvider,
  useAuth,
  useUser,
} from "@clerk/clerk-expo";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Slot, SplashScreen } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  LogBox,
  useColorScheme
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
if (!publishableKey) {
  throw new Error(
    "EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is not defined. Please set it in your .env file."
  );
}

LogBox.ignoreLogs(["Clerk : Clerk has been loaded with development keys"]); //this to ignore warning logs / logs

SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const InitialLayout = () => {
  const user = useUser();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // console.log("User:", user);
  }, [user]);
  const colorScheme = useColorScheme();

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" />; // or a loading indicator
  }
  return (
    // <View  style={{ flex: 1 }}>
    //   <Text>Initial Layout</Text>
    //  <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
    //   <StatusBar hidden={false} style={colorScheme === 'dark' ? 'light' : 'dark'} translucent />
    //   <Slot />
    // </View>
    // <SafeAreaView style={{ flex: 1 }}>
      // <StatusBar
      //   hidden={false}
      //   style={colorScheme === "dark" ? "light" : "dark"}
      //   translucent
      // />
      <Slot />

     //<StatusBar hidden={false} style={colorScheme === 'dark' ? 'light' : 'dark'} translucent /> */}
      // </SafeAreaView>
      // </View>
      // <SafeAreaView>
    //   <Slot />
    // </SafeAreaView>
  );
};

const RootLayout = () => {
  const colorScheme = useColorScheme();
  return (
    <ClerkProvider publishableKey={publishableKey} >
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <InitialLayout />
            </ThemeProvider>
          </GestureHandlerRootView>
        </ConvexProviderWithClerk>
      </ClerkLoaded>
    </ClerkProvider>

    // <InitialLayout/>
  );
};

export default RootLayout;
