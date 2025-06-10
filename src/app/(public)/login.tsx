import { isClerkAPIResponseError, useSignIn, useSignUp, useSSO } from '@clerk/clerk-expo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import Checkbox from 'expo-checkbox';
import { Link, useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { emailAtom } from '../../store/login';
import { twFullConfig } from '../../utils/twconfig';


const login = () => {
  const [loading, setLoading] = useState<'google'|'apple'|'email'| false>(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [email,setEmail] = useState("bharath26u@gmail.com");
  const setEmailAtom = useSetAtom(emailAtom);

  const {startSSOFlow} = useSSO()
  const {signUp} = useSignUp();
  const {signIn,setActive} = useSignIn();
  const router = useRouter();

  const handleSignInWithSSO = async(strategy : 'oauth_google' | 'oauth_apple' | 'oauth_github') => {
    if (strategy === 'oauth_google' || strategy === 'oauth_apple' || strategy === 'oauth_github'){
      setLoading(strategy.replace('oauth_', '') as 'google' | 'apple');
    }else{
      setLoading(false);
    }

    try{
      const {createdSessionId,setActive} = await startSSOFlow({
        strategy,
      })

      if(createdSessionId){
        setActive!({session : createdSessionId})
      }
    }catch(err){
      console.error(err,"erroer");
    }finally{
      setLoading(false);
    }
  }

  // we use this is otp wala sign in fails
  const handleEmailOTP = async() => {
      try{
        setLoading('email');
        setEmailAtom(email);
        await signUp?.create({
          emailAddress: email,
        });
        await signUp!.prepareEmailAddressVerification({strategy: 'email_code'});
        router.push('/verify')
      }catch(err){
        if(isClerkAPIResponseError(err)){
          if(err.status === 422){
            signInWithEmail()
          }else{
            Alert.alert('error','Something went wrong, please try again later');
          }
        }
        console.error("Error during email sign up:", err);
      }finally{
        setLoading(false);
      }
  }

  // fallback for sign in with email
  const signInWithEmail = async() => {
    try{
      setLoading('email')
      setEmailAtom(email);
      const signInAttempt = await signIn?.create({
        strategy: 'email_code',
        identifier: email,
      })
      console.log("signInAttempt",signInAttempt,"i entered here");
      router.push('/verify?isLogin=true')
      
    }catch(err){
      console.log("email : ",email)
      console.log(err,"i am herw")
    }finally{
      setLoading(false)
    }
  }

  const handleLinkPress = (linkType : "terms" | "privacy") => {
    Linking.openURL(linkType === "terms" ? "https://clerk.com/terms" : "https://clerk.com/privacy");
  }

  return (
    <View className='flex-1 bg-black pt-safe'>
      <View className='flex-1 p-6'> 

        <View className='flex-row justify-end'>
          {/* this is correct way of using link to provide navigation to ur button */}
          <Link href={"/faq"} asChild> 
            {/* if asChild is removed Link and Touchable wont work as we wish 
              as Link by default gets its own wrapper which may break our styles and functionality
              so we use asChild which tells the following
              “Hey Link, don’t render your own wrapper, just make my component (TouchableOpacity) behave like a link.”
            */}
            <TouchableOpacity className='bg-gray-700 rounded-xl p-2'>
              <Feather name="help-circle" size={28} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
        
        <View className='items-center py-8' > 
          <Image source={require('../../assets/images/convex.png')} className='w-40 h-40'/>
        </View>

        <Text className='text-white text-xl font-Poppins_700Bold text-center'>
              VeditAI
        </Text>

        <Text className='text-gray-400 text-md font-Poppins_400Regular text-center'>
              AI-Powered Captions Editor
        </Text>

        <TextInput
          className='bg-gray-700 rounded-xl p-4 my-8 text-gray-300'
          placeholder='Email'
          placeholderTextColor="gray"
          value = {email}
          onChangeText = {setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <View className='flex-row items-center' >
          <Checkbox
            value={isTermsChecked}
            onValueChange={setIsTermsChecked}
            className="mr-3"
            color={isTermsChecked ? (twFullConfig.theme.colors as any).primary : undefined}
          />
          <Text className='text-gray-400 text-md font-Poppins_500Medium flex-1 flex-wrap'>
            I agree to the{' '}
            <Text className='text-white underline' onPress={()=>handleLinkPress('terms')}>
              Terms of Service
            </Text>{' '}
            and acknowledge Captions{' '}
            <Text className='text-white underline' onPress={()=>handleLinkPress('terms')}>
              Privacy Policy
            </Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress = {signInWithEmail}
          disabled = {!email || !isTermsChecked || loading === 'email'} 
          className={`w-full py-4 rounded-lg my-10  ${
          !email || !isTermsChecked || loading==='email' ? 'bg-gray-800' : 'bg-primary'
        }`}>
          {loading === 'email' ? (
            <ActivityIndicator color="#F3B01C"  />
          ):(
            <Text className='text-white text-center text-lg font-Poppins_600SemiBold'>Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
            onPress = {() => handleSignInWithSSO('oauth_apple')}
            disabled = {!!loading} 
            className={`w-full py-4 rounded-lg  flex-row items-center justify-center bg-gray-800`}>
            {loading === email ? (
              <ActivityIndicator />
            ):(
              <>
                <Ionicons name='logo-apple' size={24} color={'white'} />
                <Text className='text-white ml-3 text-center text-base  font-Poppins_600SemiBold'>Continue With Apple</Text>
              </>
            )}
        </TouchableOpacity>
        
        <TouchableOpacity
            onPress = {() => handleSignInWithSSO('oauth_google')}
            disabled = {!!loading} 
            className={`w-full py-4 mt-4 rounded-lg  flex-row items-center justify-center bg-gray-800`}>
            {loading === email ? (
              <ActivityIndicator />
            ):(
              <>
                <Ionicons name='logo-google' size={24} color={'white'} />
                <Text className='text-white ml-3 text-center text-base  font-Poppins_600SemiBold'>Continue With Google</Text>
              </>
            )}
        </TouchableOpacity>


      </View>
    </View>
  )
}

export default login


//style={{borderColor:"pink", borderWidth:1}}