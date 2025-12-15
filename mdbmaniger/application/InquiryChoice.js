/**
 * @format
 * InquiryChoice.js
 * 송장번호 조회 / QR 조회 / 로그인 조회 선택 화면
 */

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

function InquiryChoiceScreen({ navigation }) {
  // '송장번호로 조회' 버튼 클릭 시
  const handleNavigateToTracking = () => {
    navigation.navigate('TrackingNumber');
  };

  // 'QR 코드로 조회' 버튼 클릭 시
  const handleNavigateToQR = () => {
    navigation.navigate('PostCheck');
  };

  // [추가] '로그인하여 조회' 버튼 클릭 시
  const handleNavigateToLoginInquiry = () => {
    navigation.navigate('LoginInquiry'); // 2단계에서 만들 화면
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>조회 방식을 선택하세요</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToTracking}>
          <Text style={styles.buttonText}>송장번호로 조회</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleNavigateToQR}>
          <Text style={styles.buttonText}>QR 코드로 조회</Text>
        </TouchableOpacity>

        {/* [추가] 로그인 조회 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleNavigateToLoginInquiry}>
          <Text style={styles.buttonText}>로그인하여 조회</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ... (스타일 코드는 이전과 동일)
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

export default InquiryChoiceScreen;