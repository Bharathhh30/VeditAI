import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Slot, SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import "../global.css";


SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const InitialLayout = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(()=>{
    if(fontsLoaded){
      SplashScreen.hideAsync()
    }
  },[fontsLoaded])
    const colorScheme = useColorScheme();

  if(!fontsLoaded) {
    return <ActivityIndicator size="large" />; // or a loading indicator
  }
  return (
    // <View  style={{ flex: 1 }}>
    //   <Text>Initial Layout</Text>
    //  <View className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
    //   <StatusBar hidden={false} style={colorScheme === 'dark' ? 'light' : 'dark'} translucent />
    //   <Slot />
    // </View>
    <SafeAreaView style={{ flex: 1 }}>
        <StatusBar  hidden={false} style = {colorScheme === 'dark' ? 'light' : 'dark'} translucent />
        {/* //<StatusBar hidden={false} style={colorScheme === 'dark' ? 'light' : 'dark'} translucent /> */}
      <Slot />
    </SafeAreaView>
    // </View>
    // <SafeAreaView>
    //   <Slot />
    // </SafeAreaView>
  )
}

const  RootLayout = () =>{
  const colorScheme = useColorScheme();
  return (
    <ConvexProvider client = {convex}>
    <GestureHandlerRootView style={{ flex: 1}}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <InitialLayout />
      </ThemeProvider>
    </GestureHandlerRootView>
    </ConvexProvider>
    // <InitialLayout/>
  )
}

export default RootLayout