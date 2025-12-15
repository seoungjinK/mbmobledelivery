/**
 * @format
 * * postSending.js
 * 택배 발송 접수 화면 (데이터 전달)
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

function PostSendingScreen({ navigation }) {
  
  // 1. 입력받을 값들을 위한 State
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderAddress, setSenderAddress] = useState('');

  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');

  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemWeight, setItemWeight] = useState('');

  // placeholder 색상
  const placeholderColor = "#A0A0A0";

  // 2. 'QR 스캔' 버튼 클릭 시 실행될 함수
  const handleGoToQRScan = () => {

    if (!senderName || !senderAddress || !receiverName || !receiverAddress || !itemName) {
      Alert.alert('입력 필요', '필수 항목(*)을 모두 입력해주세요.');
      return;
    }

    const sendingData = {
      sender: {
        name: senderName,
        phone: senderPhone,
        address: senderAddress,
      },
      receiver: {
        name: receiverName,
        phone: receiverPhone,
        address: receiverAddress,
      },
      item: {
        name: itemName,
        quantity: parseInt(itemQuantity, 10) || 1,
        weight: itemWeight,
      },
      status: '접수 대기',
      sentAt: new Date().toISOString(),
    };

    try {
      navigation.navigate('SendingQRScan', { formData: sendingData });
    } catch (e) {
      Alert.alert('이동 오류', 'QR 스캔 화면으로 이동하는 데 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>택배 발송</Text>

        {/* 보내는 분 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>보내는 분 정보</Text>

          <TextInput
            style={styles.input}
            placeholder="이름*"
            placeholderTextColor={placeholderColor}
            value={senderName}
            onChangeText={setSenderName}
          />

          <TextInput
            style={styles.input}
            placeholder="연락처"
            placeholderTextColor={placeholderColor}
            value={senderPhone}
            onChangeText={setSenderPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="주소*"
            placeholderTextColor={placeholderColor}
            value={senderAddress}
            onChangeText={setSenderAddress}
            multiline={true}
          />
        </View>

        {/* 받는 분 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>받는 분 정보</Text>

          <TextInput
            style={styles.input}
            placeholder="이름*"
            placeholderTextColor={placeholderColor}
            value={receiverName}
            onChangeText={setReceiverName}
          />

          <TextInput
            style={styles.input}
            placeholder="연락처"
            placeholderTextColor={placeholderColor}
            value={receiverPhone}
            onChangeText={setReceiverPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="주소*"
            placeholderTextColor={placeholderColor}
            value={receiverAddress}
            onChangeText={setReceiverAddress}
            multiline={true}
          />
        </View>

        {/* 물품 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>물품 정보</Text>

          <TextInput
            style={styles.input}
            placeholder="물품명* (예: 의류, 잡화)"
            placeholderTextColor={placeholderColor}
            value={itemName}
            onChangeText={setItemName}
          />

          <TextInput
            style={styles.input}
            placeholder="수량"
            placeholderTextColor={placeholderColor}
            value={itemQuantity}
            onChangeText={setItemQuantity}
            keyboardType="number-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="무게 (예: 5kg)"
            placeholderTextColor={placeholderColor}
            value={itemWeight}
            onChangeText={setItemWeight}
            keyboardType="numeric"
          />
        </View>

        {/* 발송 접수 버튼 */}
        <View style={styles.buttonContainer}>
          <Button
            title="QR 스캔으로 접수하기"
            onPress={handleGoToQRScan}
            color="#004aad"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#004aad',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    marginBottom: 10,
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 40,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

export default PostSendingScreen;
