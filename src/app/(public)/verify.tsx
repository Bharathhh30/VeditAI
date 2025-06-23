import { isClerkAPIResponseError, useSignIn, useSignUp } from '@clerk/clerk-expo'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAtomValue } from 'jotai'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { emailAtom } from '../../store/login'

const verify = () => {
  const {isLogin} = useLocalSearchParams<{isLogin?:string}>()
  // “Expect an optional isLogin parameter, and it should be a string if present.”
  const router = useRouter();
  const [code,setCode] = useState(['','','','','','']);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [countDown, setCountDown] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const email = useAtomValue(emailAtom);
  // console.log('email', email);
  const {signUp,setActive} = useSignUp();
  const {signIn} = useSignIn();
  const isCodeComplete = code.every((code)=>code !== '');

  // console.log(isLogin)

  useEffect(()=>{
    inputRefs.current[0]?.focus()
  },[])

    useEffect(() => {
      // let timer: NodeJS.Timeout; this did not work idk
    let timer: ReturnType<typeof setInterval>;
    if (isTimerRunning && countDown > 0) {
      timer = setInterval(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
    } else if (countDown === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [countDown, isTimerRunning]);

  const handleCodeChange = (text:string , index:number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Move to next input if value entered
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  
  useEffect(() => {
    if (isCodeComplete) {
      Keyboard.dismiss();
    }
  }, [isCodeComplete]);

  const handleBackspace = (index:number) =>{
    if (!code[index] && index > 0) {
      // If current input is empty and not first input, move to previous
      inputRefs.current[index - 1]?.focus();
    }
  }

  const handleResendCode = async() => {
      if (countDown === 0) {
      setCountDown(60);
      setIsTimerRunning(true);
    }

    try {
      await signUp!.prepareVerification({ strategy: 'email_code' });
    } catch (err) {
      console.log('error', JSON.stringify(err, null, 2));
    }
  }

  const handleSignIn = async() => {
      try {
      const result = await signIn!.attemptFirstFactor({
        strategy: 'email_code',
        code: code.join(''),
      });
      console.log('result', JSON.stringify(result, null, 2));
      await setActive!({ session: result.createdSessionId });
      // router.replace('/(app)/(authenticated)/(tabs)/projects');
    } catch (err) {
      console.log('error', JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message);
      }
    }
  }

  const handleCreateAccount = async() => {
     try {
      const result = await signUp!.attemptEmailAddressVerification({
        code: code.join(''),
      });
      console.log('result', JSON.stringify(result, null, 2));
      await setActive!({ session: result.createdSessionId });
      // router.replace('/(app)/(authenticated)/(tabs)/projects');
    } catch (err) {
      console.log('error', JSON.stringify(err, null, 2));
      if (isClerkAPIResponseError(err)) {
        Alert.alert('Error', err.errors[0].message);
      }
    }
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
        <View className='flex-row justify-between gap-x-1 mt-8'>
          {[0,1,2,3,4,5].map((index) => (
            <TextInput 
              key={index}
              ref = {(ref) => (inputRefs.current[index] = ref)}
              maxLength={1}
              keyboardType='number-pad'
              className={`w-[52px] h-[52px] bg-gray-800 rounded-lg text-white text-center text-xl
                ${!code[index] && index === code.findIndex((c) => !c) ? 'border-2 border-primary' : ''}`}
              value={code[index]}
              caretHidden={true}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  const newCode = [...code];
                  newCode[index] = '';
                  setCode(newCode);
                  handleBackspace(index);
                }
              }}
            />
          ))}
        </View>
        {/* Resend Code */}
        <TouchableOpacity 
          className='mt-2'
          onPress={handleResendCode}>
          <Text className={`font-Poppins_500Medium ${countDown>0 ? 'text-gray-400' : 'text-primary'}`}>Resend code {countDown > 0 ? `(${countDown}s)` : ''}</Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity
          disabled={!isCodeComplete}
          onPress={isLogin ? handleSignIn : handleCreateAccount}
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