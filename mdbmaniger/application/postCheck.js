/**
 * @format
 * PostCheck.js
 * QR 코드 스캔 조회 (Socket.io 적용)
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator, 
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

// [ 👈 핵심 ] Socket.js 가져오기
import socket from './Socket';

function PostCheckScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [scannedResult, setScannedResult] = useState(null); // 결과 텍스트 저장
  const [isChecking, setIsChecking] = useState(false);      // 조회 중 로딩 상태

  // 1. 카메라 권한
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);

  // 2. 서버 응답 리스너 (search_response)
  useEffect(() => {
    const handleSearchResponse = (response) => {
      console.log("PostCheck: 서버 응답:", response);
      setIsChecking(false); // 로딩 끝

      if (response.status === 'success') {
        const data = response.data;
        const resultText = `[조회 성공]\n\n` +
                           `송장번호: ${data.tracking_number}\n` +
                           `배송 상태: ${data.status}\n` +
                           `보내는 분: ${data.sender_name}\n` +
                           `받는 분: ${data.receiver_name}\n` +
                           `물품명: ${data.item_name}`;
        setScannedResult(resultText);
      } else {
        Alert.alert('조회 실패', response.message);
        // 실패 시 다시 스캔할 수 있게 상태 초기화는 하지 않음 (사용자가 버튼 눌러서 재시도)
      }
    };

    socket.on('search_response', handleSearchResponse);

    return () => {
      socket.off('search_response', handleSearchResponse);
    };
  }, []);

  // 3. QR 스캐너 로직
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'], 
    onCodeScanned: (codes) => {
      // 이미 조회 중이거나 결과가 떠있으면 무시
      if (isChecking || scannedResult) return; 
      
      const value = codes[0]?.value; 
      if (value) {
        console.log('스캔된 QR 값:', value);
        setIsChecking(true);
        
        // [ 👈 핵심 ] 서버에 조회 요청
        // app.py의 search_parcel은 keyword를 받습니다.
        socket.emit('search_parcel', { keyword: value });
      }
    },
  });

  // --- 렌더링 ---

  if (!hasPermission || !device) {
    return (
      <View style={styles.loadingContainer}> 
        <ActivityIndicator size="large" color="#004aad" />
        <Text style={styles.loadingText}>카메라 준비 중...</Text>
      </View>
    );
  }

  // 서버 조회 중일 때 로딩 화면
  if (isChecking) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004aad" />
        <Text style={styles.loadingText}>정보를 조회하고 있습니다...</Text>
      </View>
    );
  }

  // 조회 결과가 있을 때 결과 화면
  if (scannedResult) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.resultDisplayContainer}>
          <Text style={styles.title}>조회 결과</Text>
          <View style={styles.resultContainer}>
            <Text style={styles.resultTextLeft}>{scannedResult}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setScannedResult(null); // 결과 초기화 -> 다시 카메라 화면으로
            }}
          >
            <Text style={styles.buttonText}>다시 스캔하기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 기본 카메라 화면
  return (
    <SafeAreaView style={styles.safeArea}>
      <Camera
        device={device}
        style={StyleSheet.absoluteFill}
        isActive={true}
        codeScanner={codeScanner}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayTitle}>조회 QR 스캔</Text>
        <View style={styles.scanBox} />
        <Text style={styles.overlayText}>조회할 QR 코드를 비춰주세요.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#333' },
  resultDisplayContainer: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#004aad', textAlign: 'center' },
  resultContainer: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 20, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 20 },
  resultTextLeft: { fontSize: 16, color: '#333', lineHeight: 24 },
  button: { backgroundColor: '#004aad', paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  overlayTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', position: 'absolute', top: 100 },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 10 },
  overlayText: { fontSize: 16, color: '#FFFFFF', marginTop: 20 },
});

export default PostCheckScreen;