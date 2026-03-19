import React, { useState, useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

interface AnimatedModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

export function AnimatedModal({ isOpen, onRequestClose, children }: AnimatedModalProps) {
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
      <Animated.View style={{ flex: 1, opacity: backdropOpacity }}>
        <Pressable className="flex-1 bg-black/50 justify-end" onPress={onRequestClose}>
          <Animated.View
            style={{ transform: [{ translateY }] }}
            className="bg-white dark:bg-gray-800 rounded-t-2xl max-h-[80%]"
          >
            <SafeAreaView>
              <Pressable onPress={() => {}}>
                {children}
              </Pressable>
            </SafeAreaView>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}
