/**
 * @format
 * App.tsx
 * 네비게이션을 설정하는 메인 파일
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';

// 모든 화면 import
import LogInScreen from './logIn';
import PostSendingScreen from './postSending';
import PostCheckScreen from './postCheck';
import InquiryChoiceScreen from './InquiryChoice';
import TrackingNumberScreen from './TrackingNumber';
import LoginInquiryScreen from './LoginInquiry';
import SendingChoiceScreen from './SendingChoice'; 
import LoginSendingScreen from './LoginSending'; 
import SendingQRScanScreen from './SendingQRScan'; // 새로 추가된 화면

// 2. 스택 네비게이터의 타입 정의 (TypeScript)
export type RootStackParamList = {
  Login: undefined;
  PostSending: undefined;
  PostCheck: undefined;
  InquiryChoice: undefined;
  TrackingNumber: undefined;
  LoginInquiry: undefined;
  SendingChoice: undefined; 
  LoginSending: undefined; 
  SendingQRScan: { formData: object }; // 폼 데이터를 파라미터로 받음
};

// 3. 스택 네비게이터 생성
const Stack = createNativeStackNavigator<RootStackParamList>();

// 4. App 함수
function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        <Stack.Screen
          name="Login"
          component={LogInScreen}
          options={{
            headerTitle: () => (
              <Image
                source={require('./images/logo.png')}
                style={{ width: 120, height: 30, resizeMode: 'contain' }}
              />
            ),
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="PostSending"
          component={PostSendingScreen}
          options={{ title: '택배 접수' }}
        />
        <Stack.Screen
          name="PostCheck"
          component={PostCheckScreen}
          options={{ title: 'QR 스캔' }}
        />
        <Stack.Screen
          name="InquiryChoice"
          component={InquiryChoiceScreen}
          options={{ title: '조회 방식 선택' }}
        />
        <Stack.Screen
          name="TrackingNumber"
          component={TrackingNumberScreen}
          options={{ title: '송장번호 조회' }}
        />
        <Stack.Screen
          name="LoginInquiry"
          component={LoginInquiryScreen}
          options={{ title: '로그인 조회' }}
        />
        <Stack.Screen
          name="SendingChoice"
          component={SendingChoiceScreen}
          options={{ title: '접수 방식 선택' }}
        />
        <Stack.Screen
          name="LoginSending"
          component={LoginSendingScreen}
          options={{ title: '회원 접수' }}
        />

        {/* 새로 추가된 접수 QR 스캔 화면 등록 */}
        <Stack.Screen
          name="SendingQRScan"
          component={SendingQRScanScreen}
          options={{ title: '접수 QR 스캔' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;