import { View, Text, ImageBackground, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Audio } from 'expo-av';
import meditationImages from '@/constants/meditation-images'
import AppGradient from '@/components/AppGradient'
import { router, useLocalSearchParams } from 'expo-router'
import { AntDesign } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton'
import { AUDIO_FILES, MEDITATION_DATA } from '@/constants/MeditationData';
import { TimerContext } from '../context/TimerContext';

const Meditate = () => {
    const { id } = useLocalSearchParams();

    const { duration: secondsRemaining, setDuration } = useContext(TimerContext);

    //const [secondsRemaining, setSecondRemaining] = useState(10);
    const [isMeditaing, setMeditaing] = useState(false);
    const [audioSound, setSound] = useState<Audio.Sound>();
    const [isPlayingAudio, setPlayingAudio] = useState(false);

    useEffect(() => {
        let timerId: NodeJS.Timeout;

        //Exit
        if (secondsRemaining === 0) {
            setMeditaing(false);
            return;
        }

        if (isMeditaing) {
            timerId = setTimeout(() => {
                setDuration(secondsRemaining - 1);
            }, 1000);
        }

        return () => {
            clearTimeout(timerId);
        }
    }, [secondsRemaining, isMeditaing]);

    useEffect(() => {
        return () => {
            setDuration(10);
            audioSound?.unloadAsync();
        }
    }, [audioSound]);

    const toggleMeditationSessionStatus = async() => {
        if (secondsRemaining === 0) setDuration(10);

        setMeditaing(!isMeditaing);

        await toggleSound();
    }

    const toggleSound = async () => {
        const sound = audioSound ? audioSound : await initializeSound();

        const status = await sound?.getStatusAsync();

        if (status?.isLoaded) {
            await sound.playAsync();
            setPlayingAudio(true);
        } else {
            await sound.pauseAsync();
            setPlayingAudio(false);
        }
    }

    const initializeSound = async () => {
        const audioFileName = MEDITATION_DATA[Number(id) - 1].audio;

        const { sound } = await Audio.Sound.createAsync(
            AUDIO_FILES[audioFileName]
        );

        setSound(sound);
        return sound;
    }

    const handleAdjustDuration = () => {
        if (isMeditaing) return toggleMeditationSessionStatus();

        router.push("/(modal)/adjustMeditationDuration");
    }

    // format the time left to ensure two digits are displayed
    const formattedTimeMinutes = String(Math.floor(secondsRemaining / 60)).padStart(2, "0");
    const formattedTimeSeconds= String(secondsRemaining % 60).padStart(2,'0')

  return (
    <View className='flex-1'>
          <ImageBackground
              source={meditationImages[Number(id)-1]}
              resizeMode='cover'
              className='flex-1'
          >
              <AppGradient colors={["transparent","rgba(0,0,0,0.8)"]}>
                  <Pressable 
                      onPress={() => router.back()}        //implementing back button on top
                      className='absolute top-16 lest-6 z-10'
                  >
                      <AntDesign name="leftcircleo" size={50} color="white" />
                  </Pressable>

                  <View className='flex-1 justify-center'>
                      <View className='mx-auto bg-neutral-200 rounded-full w-44 h-44 justify-center items-center'>
                          <Text className='text-4xl text-blue-800 font-rmono'>
                              {formattedTimeMinutes}:{formattedTimeSeconds}
                          </Text>
                      </View>
                  </View>

                  <View className='mb-5'>
                  <CustomButton
                          title='Adjust Duration'
                          onPress={handleAdjustDuration}
                          containerStyles='mb-5'
                      />

                      <CustomButton
                          title={isMeditaing ? "Stop" : "Start Meditation"}
                          onPress={toggleMeditationSessionStatus}
                      />
                  </View>
              </AppGradient>
              
     </ImageBackground>
    </View>
  )
}

export default Meditate