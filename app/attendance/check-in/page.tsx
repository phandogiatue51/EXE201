import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface CheckinState {
  isCheckingIn: boolean;
  isCheckingOut: boolean;
  currentRecordId?: number;
  lastAction?: 'checkin' | 'checkout';
  lastProjectName?: string;
  lastCheckinTime?: Date;
}

const API_BASE_URL = 'https://your-api-domain.com/api'; // Change to your API URL

const CheckinScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkinState, setCheckinState] = useState<CheckinState>({
    isCheckingIn: true, // Default to check-in mode
    isCheckingOut: false,
  });
  const [showCamera, setShowCamera] = useState(false);

  // Request camera permission
  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Load last state from storage
  useFocusEffect(
    React.useCallback(() => {
      loadLastState();
    }, [])
  );

  const loadLastState = async () => {
    try {
      const savedState = await AsyncStorage.getItem('checkinState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Check if still valid (within same day)
        if (parsed.lastCheckinTime) {
          const lastDate = new Date(parsed.lastCheckinTime);
          const today = new Date();
          if (
            lastDate.getDate() === today.getDate() &&
            lastDate.getMonth() === today.getMonth() &&
            lastDate.getFullYear() === today.getFullYear()
          ) {
            setCheckinState(parsed);
          } else {
            // Reset if it's a new day
            await AsyncStorage.removeItem('checkinState');
            setCheckinState({
              isCheckingIn: true,
              isCheckingOut: false,
            });
          }
        } else {
          setCheckinState(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  };

  const saveState = async (state: CheckinState) => {
    try {
      await AsyncStorage.setItem('checkinState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setLoading(true);
    
    try {
      // Parse the QR code data
      let token: string;
      
      // Handle both deep link and URL formats
      if (data.startsWith('together://checkin/')) {
        token = data.replace('together://checkin/', '');
      } else if (data.includes('/checkin/')) {
        // Extract token from URL like https://domain.com/checkin/{token}
        const urlParts = data.split('/checkin/');
        token = urlParts[1];
      } else {
        // Assume it's just the token
        token = data;
      }

      // Get auth token (assuming you have stored it)
      const authToken = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      const response = await fetch(`${API_BASE_URL}/qr/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          qrToken: token,
          actionTime: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        const actionData = result.data;
        
        if (actionData.action === 'check-in') {
          // Successfully checked in
          const newState: CheckinState = {
            isCheckingIn: false,
            isCheckingOut: true,
            currentRecordId: actionData.recordId,
            lastAction: 'checkin',
            lastProjectName: actionData.message?.match(/Checked in to (.+)/)?.[1] || 'Unknown Project',
            lastCheckinTime: new Date(actionData.time),
          };
          
          setCheckinState(newState);
          await saveState(newState);
          
          Alert.alert(
            'Checked In Successfully!',
            `You are now checked into ${newState.lastProjectName}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  setShowCamera(false);
                  setScanned(false);
                  setLoading(false);
                },
              },
            ]
          );
        } else if (actionData.action === 'check-out') {
          // Successfully checked out
          const newState: CheckinState = {
            isCheckingIn: true,
            isCheckingOut: false,
            lastAction: 'checkout',
            lastProjectName: actionData.message?.match(/Checked out from (.+)/)?.[1] || 'Unknown Project',
          };
          
          setCheckinState(newState);
          await saveState(newState);
          
          Alert.alert(
            'Checked Out Successfully!',
            `You worked ${actionData.hoursWorked?.toFixed(2)} hours.\nTotal hours: ${actionData.totalHours?.toFixed(2)}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  setShowCamera(false);
                  setScanned(false);
                  setLoading(false);
                },
              },
            ]
          );
        }
      } else {
        throw new Error(result.message || 'Scan failed');
      }
    } catch (error: any) {
      console.error('Scan error:', error);
      Alert.alert(
        'Scan Failed',
        error.message || 'Unable to process QR code. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: () => {
              setScanned(false);
              setLoading(false);
            },
          },
        ]
      );
    }
  };

  const handleManualCheckout = async () => {
    if (!checkinState.currentRecordId) return;
    
    Alert.alert(
      'Manual Check Out',
      'Are you sure you want to check out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Check Out',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const authToken = await AsyncStorage.getItem('authToken');
              
              // Call your API for manual checkout
              const response = await fetch(`${API_BASE_URL}/hours/manual-checkout`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                  recordId: checkinState.currentRecordId,
                  checkOutTime: new Date().toISOString(),
                }),
              });
              
              const result = await response.json();
              
              if (result.success) {
                // Reset state
                const newState: CheckinState = {
                  isCheckingIn: true,
                  isCheckingOut: false,
                };
                
                setCheckinState(newState);
                await AsyncStorage.removeItem('checkinState');
                
                Alert.alert('Success', 'Checked out successfully');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to check out manually');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
        <Text style={styles.description}>
          Camera permission is required to scan QR codes. Please enable it in your device settings.
        </Text>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <StatusBar barStyle="light-content" />
        <Camera
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
        />
        
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
        </View>
        
        <View style={styles.cameraControls}>
          <Text style={styles.scanInstruction}>
            {checkinState.isCheckingIn ? 'Scan QR code to check in' : 'Scan QR code to check out'}
          </Text>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setShowCamera(false);
              setScanned(false);
              setLoading(false);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Time Tracker</Text>
        <Text style={styles.subtitle}>
          {checkinState.isCheckingIn ? 'Ready to check in' : 'Currently checked in'}
        </Text>
      </View>
      
      <View style={styles.statusCard}>
        {checkinState.isCheckingIn ? (
          <>
            <Text style={styles.statusIcon}>⏰</Text>
            <Text style={styles.statusText}>Ready to start work</Text>
            <Text style={styles.statusDescription}>
              Scan a project QR code to begin tracking your time
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.statusIcon}>✅</Text>
            <Text style={styles.statusText}>Currently checked in</Text>
            <Text style={styles.projectName}>{checkinState.lastProjectName}</Text>
            <Text style={styles.timeText}>
              Since: {checkinState.lastCheckinTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={styles.statusDescription}>
              Scan QR code again to check out
            </Text>
          </>
        )}
      </View>
      
      <TouchableOpacity
        style={[
          styles.scanButton,
          checkinState.isCheckingIn ? styles.checkinButton : styles.checkoutButton,
        ]}
        onPress={() => setShowCamera(true)}
        disabled={loading}
      >
        <Text style={styles.scanButtonText}>
          {loading ? 'Processing...' : 
           checkinState.isCheckingIn ? 'Scan QR to Check In' : 'Scan QR to Check Out'}
        </Text>
        {!loading && <Text style={styles.scanButtonIcon}>📷</Text>}
      </TouchableOpacity>
      
      {checkinState.isCheckingOut && (
        <TouchableOpacity
          style={styles.manualButton}
          onPress={handleManualCheckout}
          disabled={loading}
        >
          <Text style={styles.manualButtonText}>Manual Check Out</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Recent Activity</Text>
        {/* You can add a list of recent check-ins/outs here */}
        <Text style={styles.historyEmpty}>
          {checkinState.lastAction
            ? `Last action: ${checkinState.lastAction} at ${checkinState.lastProjectName}`
            : 'No recent activity'}
        </Text>
      </View>
    </View>
  );
};

export default CheckinScreen;