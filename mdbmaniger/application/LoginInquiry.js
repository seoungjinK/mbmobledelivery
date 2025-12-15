/**
 * @format
 * LoginInquiry.js
 * 로그인하여 조회하는 화면 (Socket.io 적용)
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

// [ 👈 핵심 ] Socket.js 가져오기
import socket from './Socket';

function LoginInquiryScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 1. 서버 응답 리스너 등록
  useEffect(() => {
    const handleLoginResponse = (response) => {
      console.log("LoginInquiry: 서버 응답:", response);

      if (response.status === 'success') {
        // 로그인 성공 시
        Alert.alert(
          '로그인 성공', 
          response.message,
          [
            {
              text: '확인',
              onPress: () => {
                // TODO: 로그인 성공 후 실제 '내 배송 목록' 화면으로 이동
                // 현재는 예시로 송장번호 조회 화면으로 이동하거나, 
                // 추후 구현할 MyInquiryList 화면으로 연결하면 됩니다.
                navigation.navigate('InquiryChoice'); 
              }
            }
          ]
        );
      } else {
        // 로그인 실패
        Alert.alert('로그인 실패', response.message);
      }
    };

    // 리스너 연결
    socket.on('login_response', handleLoginResponse);

    // 컴포넌트 언마운트 시 리스너 해제
    return () => {
      socket.off('login_response', handleLoginResponse);
    };
  }, [navigation]);

  // 2. '로그인' 버튼 클릭 시
  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('알림', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 소켓 연결 상태 확인
    if (!socket.connected) {
      socket.connect();
      Alert.alert('연결 중', '서버에 연결하고 있습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // [ 👈 핵심 ] Socket.io 이벤트 전송
    const loginData = {
      username: username,
      password: password,
    };
    
    console.log('LoginInquiry: 로그인 요청:', loginData);
    socket.emit('login_request', loginData);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>로그인</Text>

        {/* 아이디 입력창 */}
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        {/* 비밀번호 입력창 */}
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인 후 조회</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 스타일 유지
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5ff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#004aad',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#004aad',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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

export default LoginInquiryScreen;