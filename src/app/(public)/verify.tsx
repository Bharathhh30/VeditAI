import { useSignIn, useSignUp } from '@clerk/clerk-expo'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue } from 'jotai'
import React, { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { emailAtom } from '../../store/login'

const verify = () => {
  const {isLogin} = useLocalSearchParams<{isLogin?:string}>()
  // “Expect an optional isLogin parameter, and it should be a string if present.”
  const router = useRouter();
  const [code,setCode] = useState(['','','','','','']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [countDown, setCountDown] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const email = useAtomValue(emailAtom);
  console.log('email', email);
  const {signUp,setActive} = useSignUp();
  const {signIn} = useSignIn();
  const isCodeComplete = code.every((code)=>code !== '');

  console.log(isLogin)

  useEffect(()=>{
    inputRefs.current[0]?.focus()
  },)

  const handleResendCode = () => {

  }


  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? "padding" : "height"} className='flex-1'>
      <View className='flex-1 bg-black px-6 pt-safe '>
        <Text>verify</Text>
        <TouchableOpacity className='w-10 h-10 bg-gray-800 rounded-xl justify-center' onPress={()=>router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={32} color="white" />
        </TouchableOpacity>

        <Text className='text-white text-xl font-Poppins_600SemiBold mt-20'>Enter Code</Text>
        <Text className='text-gray-400 mt-2 font-Poppins_400Regular'>
          Check your email for the code we sent to {'\n'}
          <Text className='text-white'>{email}</Text>
        </Text>

        {/* Code Input */}
        
        {/* Resend Code */}
        <TouchableOpacity 
          
          onPress={handleResendCode}>
          <Text className={`font-Poppins_500Medium ${countDown>0 ? 'text-gray-400' : 'text-primary'}`}>Resend code {countDown > 0 ? `(${countDown}s)` : ''}</Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity
          disabled={!isCodeComplete}
          className={`rounded-lg py-4 mt-auto mb-8 transition-colors duration-300 ${isCodeComplete ? 'bg-primary' : 'bg-gray-900'}`}
        >
          <Text
            className={`text-center text-lg font-Poppins_600SemiBold  transition-colors duration-300 ${isCodeComplete ? 'text-white' : 'text-gray-400'} `}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default verify