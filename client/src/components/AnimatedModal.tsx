import React, { useState, useEffect, useRef } from 'react';
import { Animated, Dimensions, Modal, Pressable, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardStickyView } from "react-native-keyboard-controller";

interface AnimatedModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

export function AnimatedModal({ isOpen, onRequestClose, children }: AnimatedModalProps) {
  const { height } = Dimensions.get('screen');
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useRef(new Animated.Value(800)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 800,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setModalVisible(false);
      });
    }
  }, [isOpen]);

  return (
    <Modal
      visible={modalVisible}
      transparent
      onRequestClose={onRequestClose}
    >
      {/* Backdrop */}
      <Animated.View style={{ opacity: backdropOpacity }} className="absolute inset-0">
        <Pressable className="flex-1 bg-black/50" onPress={onRequestClose} />
      </Animated.View>

      {/* Sheet */}
      <KeyboardStickyView
        className="flex-1 justify-end"
        pointerEvents="box-none"
        offset={{ closed: 0, opened: insets.bottom }}
      >
        <Animated.View
          style={{ transform: [{ translateY }], paddingBottom: height, marginBottom: -height }}
          className="bg-white dark:bg-gray-800 rounded-t-2xl"
        >
          <View style={{ paddingBottom: insets.bottom }}>
            {children}
          </View>
        </Animated.View>
      </KeyboardStickyView>
    </Modal>
  );
}
