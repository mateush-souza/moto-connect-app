
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import Register from "../screens/Register";
import Home from "../screens/Home";
import MotorcycleRegistration from "../screens/MotorcycleRegistration";
import RFIDScreen from "../screens/RFIDScreen";
import { SuccessScreen } from "../screens/SuccessScreen";
import { ErrorScreen } from "../screens/ErrorScreen";
import MotorcycleList from "../screens/MotorcycleList";
import Settings from "../screens/Settings";
import About from "../screens/About";
import { useTheme } from "../contexts/ThemeContext";


export type RootStackParamList = {
  Home: undefined;
  MotorcycleRegistration: undefined;
  MotorcycleList: undefined;
  Register: undefined;
  Login: undefined;
  RFIDScreen: { motoData: any };
  SuccessScreen: { motoData: any };
  ErrorScreen: { motoData: any};
  Settings: undefined;
  About: undefined;
};


const { Navigator, Screen } = createNativeStackNavigator();

export default function Routes() {
  const { theme } = useTheme();
  const navigationTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <Navigator
        id={undefined}
        screenOptions={{
          headerShown: false
        }}
      >
        <Screen name="Login" component={Login} />
        <Screen name="Register" component={Register} />
        <Screen name="Home" component={Home} />
        <Screen name="MotorcycleRegistration" component={MotorcycleRegistration} />
        <Screen name="MotorcycleList" component={MotorcycleList} />
        <Screen name="RFIDScreen" component={RFIDScreen} />
        <Screen name="SuccessScreen" component={SuccessScreen} />
        <Screen name="ErrorScreen" component={ErrorScreen} />
        <Screen name="Settings" component={Settings} />
        <Screen name="About" component={About} />
      </Navigator>
    </NavigationContainer>
  )
}
