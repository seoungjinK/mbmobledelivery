/**
 * @format
 * TrackingNumber.js
 * 송장번호 입력 조회 (Socket.io 적용)
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
  ActivityIndicator,
} from 'react-native';

// [ 👈 핵심 ] Socket.js 가져오기
import socket from './Socket'; 

function TrackingNumberScreen({ navigation }) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. 서버 응답 리스너 (search_response)
  useEffect(() => {
    const handleSearchResponse = (response) => {
      console.log("TrackingNumber: 서버 응답:", response);
      setIsLoading(false); // 로딩 끝

      if (response.status === 'success') {
        const data = response.data;
        // 결과 표시
        Alert.alert(
          '조회 성공',
          `송장번호: ${data.tracking_number}\n` +
          `상태: ${data.status}\n` +
          `물품명: ${data.item_name}\n` +
          `받는 분: ${data.receiver_name}`
        );
      } else {
        Alert.alert('조회 실패', response.message);
      }
    };

    socket.on('search_response', handleSearchResponse);

    return () => {
      socket.off('search_response', handleSearchResponse);
    };
  }, []);

  // 2. 조회하기 버튼 클릭
  const handleInquiry = () => {
    if (!trackingNumber.trim()) {
      Alert.alert('알림', '송장번호를 입력해주세요.');
      return;
    }

    if (!socket.connected) {
      socket.connect();
      Alert.alert('연결 중', '서버와 다시 연결 중입니다. 잠시 후 시도해주세요.');
      return;
    }

    setIsLoading(true);

    // [ 👈 핵심 ] 서버의 'search_parcel' 이벤트 호출
    // app.py에서 keyword로 받으므로 키 이름을 keyword로 보냅니다.
    const requestData = { keyword: trackingNumber.trim() };
    console.log('TrackingNumber: 조회 요청:', requestData);
    
    socket.emit('search_parcel', requestData);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>송장번호 조회</Text>
        
        <TextInput
          style={styles.input}
          placeholder="송장번호 입력"
          value={trackingNumber}
          onChangeText={setTrackingNumber}
          autoFocus={true}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleInquiry}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>조회하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, padding: 20, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 50 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, color: '#004aad' },
  input: { width: '100%', height: 50, backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 25 },
  button: { backgroundColor: '#004aad', paddingVertical: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: '100%', height: 55, elevation: 5 },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
});

export default TrackingNumberScreen;