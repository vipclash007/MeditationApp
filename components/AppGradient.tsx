
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

// making safe_area_view and app_Gradient into a reusable component

const Content = ({ children }: any) => {
    return <SafeAreaView className='flex-1 px-5 py-3'>
        {children}
    </SafeAreaView>
}

const AppGradient = ({
    children,
    colors,
}: {
        children: any;
        colors: string[];
}) => {
  return (
    <LinearGradient colors={colors} className='flex-1'>
          <Content>{ children}</Content>
    </LinearGradient>
  )
}



export default AppGradient