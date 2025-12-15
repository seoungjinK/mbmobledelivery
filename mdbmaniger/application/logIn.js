/**
 * @format
 * logIn.js
 * 앱의 첫 화면 (메인/홈 화면)
 */

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert, // '관리자' 버튼 알림창에 사용
  Image,
} from 'react-native';

function LogInScreen({ navigation }) {
  // 'QR조회' 버튼 클릭 시
  const handleTrack = () => {
    // App.tsx에 등록한 'PostCheck' 별명(name)의 화면으로 이동합니다.
    navigation.navigate('InquiryChoice');
  };

  // '관리자' 버튼 클릭 시
  const handleAdmin = () => {
    // 'PostSending'으로 이동하는 대신 알림창을 띄웁니다.
    // TODO: 추후 관리자 화면이 생기면 navigation.navigate('AdminScreen') 등으로 변경
    navigation.navigate('SendingChoice');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 로고 이미지 */}
        <Image
          source={require('./images/logo.png')} // App.tsx에서 사용한 동일한 이미지 경로
          style={styles.logo} // 아래에 새로 추가한 로고 스타일을 적용
        />

        {/* 1. '택배조회' -> 'QR조회'로 텍스트 변경 */}
        <TouchableOpacity style={styles.button} onPress={handleTrack}>
          <Text style={styles.buttonText}>택배 조회</Text>
        </TouchableOpacity>

        {/* 2. '택배 신청' -> '관리자'로 텍스트 및 핸들러 변경 */}
        <TouchableOpacity style={styles.button} onPress={handleAdmin}>
          <Text style={styles.buttonText}>택배 접수</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 스타일 정의 (변경 사항 없음)
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF', // 기본 배경색
  },
  container: {
    flex: 1,
    justifyContent: 'center', // 내용을 세로 중앙에 배치
    alignItems: 'center', // 내용을 가로 중앙에 배치
    padding: 20,
  },
  /* 로고 스타일 */
  logo: {
    width: '80%', // 로고의 가로 폭 (화면의 80%)
    height: 100, // 로고의 세로 높이 (적절히 조절)
    resizeMode: 'contain', // 이미지가 비율을 유지하며 영역 안에 표시되도록 함
    marginBottom: 70, // 버튼과의 간격
  },
  button: {
    // 버튼 스타일
    backgroundColor: '#004aad',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '90%', // 버튼 가로 폭
    alignItems: 'center', // 버튼 안의 텍스트를 중앙 정렬
    marginBottom: 20, // 버튼 사이의 간격

    // 그림자 효과 (선택 사항)
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
    // 버튼 텍스트 스타일
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

// 다른 파일(예: App.js)에서 이 컴포넌트를 쓸 수 있게 export
export default LogInScreen;