import { createStackNavigator } from '@react-navigation/stack';
import CheckinScreen from './CheckinScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Checkin" 
        component={CheckinScreen}
        options={{ title: 'Time Tracker' }}
      />
    </Stack.Navigator>
  );
}