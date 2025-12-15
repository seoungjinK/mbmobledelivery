/**
 * @format
 * SendingQRScan.js
 * 접수용 QR 코드 스캔 및 서버 전송 (Socket.io 적용)
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
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

function SendingQRScanScreen({ navigation, route }) {
  const { formData } = route.params; // 이전 화면에서 받은 데이터

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [isScanned, setIsScanned] = useState(false); // 스캔 상태 관리

  // 1. 카메라 권한 요청
  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission, requestPermission]);
  
  // 2. 소켓 응답 리스너 설정
  useEffect(() => {
    const handleRegisterResponse = (response) => {
      console.log("SendingQRScan: 서버 응답:", response);
      
      if (response.status === 'success') {
        Alert.alert(
          '접수 완료', 
          `${response.message}\n송장번호: ${response.tracking_number}`,
          [
            { 
              text: '메인으로', 
              onPress: () => navigation.navigate('Login') // 메인 화면으로 이동
            }
          ]
        );
      } else {
        Alert.alert('접수 실패', response.message);
        setIsScanned(false); // 실패 시 다시 스캔 가능하도록 풀기
      }
    };

    socket.on('register_response', handleRegisterResponse);

    return () => {
      socket.off('register_response', handleRegisterResponse);
    };
  }, [navigation]);

  // 3. QR 코드 스캐너 설정
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      // 이미 스캔 중이면 무시
      if (isScanned) return;
      
      const value = codes[0]?.value;
      if (value) {
        setIsScanned(true); // 스캔 잠금
        console.log('스캔된 QR 값:', value);

        // 데이터 결합
        const finalData = { 
          ...formData, 
          qr_code: value 
        };
        
        // [ 👈 핵심 ] 서버로 전송
        console.log("서버로 전송:", finalData);
        socket.emit('register_parcel', finalData);
      }
    },
  });

  // --- 렌더링 ---

  if (!hasPermission || !device) {
    return (
      <View style={styles.loadingContainer}>         
        <ActivityIndicator size="large" color="#004aad" />
        <Text style={styles.loadingText}>카메라 로딩 중...</Text>
      </View>
    );
  }

  if (isScanned) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004aad" />
        <Text style={styles.loadingText}>서버로 접수 정보를 전송하고 있습니다...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Camera
        device={device}
        style={StyleSheet.absoluteFill}
        isActive={true}
        codeScanner={codeScanner}
      />
      <View style={styles.overlay}>
        <Text style={styles.overlayTitle}>접수 QR 코드 스캔</Text>
        <View style={styles.scanBox} />
        <Text style={styles.overlayText}>택배 박스의 QR 코드를 스캔하세요.</Text>
      </View>
    </SafeAreaView>
  );
}

// 스타일 유지
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#333' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  overlayTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', position: 'absolute', top: 100 },
  scanBox: { width: 250, height: 250, borderWidth: 2, borderColor: '#FFFFFF', borderRadius: 10 },
  overlayText: { fontSize: 16, color: '#FFFFFF', marginTop: 20 },
});

export default SendingQRScanScreen;