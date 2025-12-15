/**
 * @format
 * LoginSending.js
 * 회원 접수 로그인 화면 (Socket.io 적용)
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

// [ 👈 핵심 ] 우리가 만든 Socket.js 가져오기
import socket from './Socket'; 

function LoginSendingScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 1. 서버 응답 리스너 등록
  useEffect(() => {
    // 로그인 응답 처리
    const handleLoginResponse = (response) => {
      console.log("LoginSending: 서버 응답:", response);

      if (response.status === 'success') {
        Alert.alert(
          '로그인 성공',
          `${response.message}`,
          [
            {
              text: '확인',
              onPress: () => {
                // 로그인 성공 시 접수 폼 화면으로 이동
                navigation.navigate('PostSending');
              },
            },
          ]
        );
      } else {
        Alert.alert('로그인 실패', response.message);
      }
    };

    // 이벤트 리스너 연결
    socket.on('login_response', handleLoginResponse);

    // 컴포넌트가 사라질 때 리스너 제거 (중복 실행 방지)
    return () => {
      socket.off('login_response', handleLoginResponse);
    };
  }, [navigation]);

  // 2. 로그인 버튼 클릭 시
  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('알림', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 소켓이 연결되어 있는지 확인
    if (!socket.connected) {
      socket.connect();
      Alert.alert('연결 중', '서버에 다시 연결하고 있습니다. 잠시 후 시도해주세요.');
      return;
    }

    // [ 👈 핵심 ] 데이터 전송 (emit)
    const loginData = {
      username: username,
      password: password,
    };
    
    console.log('LoginSending: 전송 데이터:', loginData);
    socket.emit('login_request', loginData);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>회원 로그인</Text>

        <TextInput
          style={styles.input}
          placeholder="아이디 (이메일)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인 후 접수</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 스타일은 기존과 동일하므로 생략하거나 그대로 유지
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5ff' },
  container: { flex: 1, padding: 20, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 50 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, color: '#004aad' },
  input: { width: '100%', height: 50, backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 15 },
  button: { backgroundColor: '#004aad', paddingVertical: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: '100%', height: 55, marginTop: 15, elevation: 5 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});

export default LoginSendingScreen;