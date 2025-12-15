/**
 * @format
 * SendingChoice.js
 * 회원 접수 / 비회원 접수 선택 화면
 */

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

function SendingChoiceScreen({ navigation }) {
  // '회원 접수' 버튼 클릭 시
  const handleNavigateToMember = () => {
    navigation.navigate('LoginSending'); // 3단계에서 만들 화면
  };

  // '비회원 접수' 버튼 클릭 시
  const handleNavigateToNonMember = () => {
    navigation.navigate('PostSending'); // 기존 접수 폼 화면
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>접수 방식을 선택하세요</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToMember}>
          <Text style={styles.buttonText}>회원 접수</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToNonMember}>
          <Text style={styles.buttonText}>비회원 접수</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// InquiryChoice.js와 동일한 스타일 적용
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#004aad',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SendingChoiceScreen;