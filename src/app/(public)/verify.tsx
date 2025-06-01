import { useSignIn, useSignUp } from '@clerk/clerk-expo'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue } from 'jotai'
import React, { useEffect, useRef, useState } from 'react'
import { Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
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
  const {signUp,setActive} = useSignUp();
  const {signIn} = useSignIn();

  useEffect(()=>{
    inputRefs.current[0]?.focus()
  },)


  return (
    <View>
      <Text>verify</Text>
    </View>
  )
}

export default verify