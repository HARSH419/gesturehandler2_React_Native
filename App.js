/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import useWindowDimensions from 'react-native/Libraries/Utilities/useWindowDimensions';

const useFollowAnimatedPosition = ({x, y}) => {
  const FollowX = useDerivedValue(() => {
    return withSpring(x?.value);
  });
  const FollowY = useDerivedValue(() => {
    return withSpring(y?.value);
  });

  const animateStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: FollowX.value}, {translateY: FollowY.value}],
    };
  });
  return {FollowX, FollowY, animateStyle};
};

const SIZE = 80;

const App = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = useWindowDimensions();

  const context = useSharedValue({x: 0, y: 0});

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = {x: translateX.value, y: translateY.value};
    })
    .onUpdate(event => {
      // console.log({event});
      translateX.value = event.translationX + context.value.x;
      translateY.value = event.translationY + context.value.y;
    })
    .onEnd(() => {
      if (translateX.value == SCREEN_WIDTH / 2) {
        translateX.value = SCREEN_WIDTH - SIZE;
        // translateY.value = SCREEN_HEIGHT - SIZE;
      } else {
        translateX.value = 0;
      }
    });

  const {
    FollowX: followBX,
    FollowY: followBY,
    animateStyle: blueAnimateStyle,
  } = useFollowAnimatedPosition({x: translateX, y: translateY});
  const {
    FollowX,
    FollowY,
    animateStyle: redAnimateStyle,
  } = useFollowAnimatedPosition({
    x: followBX,
    y: followBY,
  });

  console.log({SCREEN_HEIGHT});

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View
        style={[styles.circle, {backgroundColor: 'red'}, redAnimateStyle]}
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.circle, blueAnimateStyle]} />
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    height: SIZE,
    aspectRatio: 1,
    backgroundColor: 'blue',
    borderRadius: 100,
  },
});
