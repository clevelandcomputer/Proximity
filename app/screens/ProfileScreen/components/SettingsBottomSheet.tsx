import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modalize from 'react-native-modalize';
import Checkbox from 'react-native-modest-checkbox';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from 'react-navigation-hooks';
import { IconSizes, Routes } from '../../../constants';
import { AppContext } from '../../../context';
import { BottomSheetHeader } from '../../../layout';
import { ThemeStatic, ThemeVariant, Typography } from '../../../theme';
import { ThemeColors } from '../../../types/theme';
import { signOut } from '../../../utils/authentication';

const { FontWeights, FontSizes } = Typography;

interface OptionProps {
  label?: string,
  iconName: string,
  onPress?: any,
  children?: any
};

const Option: React.FC<OptionProps> = ({ label, iconName, onPress, children }) => {
  const { theme } = useContext(AppContext);

  if (children)
    return (
      <View style={styles().option}>
        <Ionicons name={iconName} size={IconSizes.x5} color={theme.text01} />
        {children}
      </View>
    );

  return (
    <TouchableOpacity style={styles().option} activeOpacity={0.9} onPress={onPress}>
      <Ionicons name={iconName} size={IconSizes.x5} color={theme.text01} />
      <Text style={styles(theme).optionLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

interface SettingsBottomSheetProps {
  ref: React.Ref<any>,
  onAboutPress: any
};

const SettingsBottomSheet: React.FC<SettingsBottomSheetProps> = React.forwardRef(({ onAboutPress }, ref) => {

  const { toggleTheme, theme, themeType } = useContext(AppContext);
  const { navigate } = useNavigation();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(themeType === ThemeVariant.dark);
  }, []);

  const onChange = ({ checked }) => {
    if (checked) toggleTheme(ThemeVariant.dark);
    else toggleTheme(ThemeVariant.light);
    setIsChecked(checked);
  };

  const logOut = async () => {
    await signOut();
    navigate(Routes.Auth);
  };

  return (
    <Modalize
      //@ts-ignore
      ref={ref}
      scrollViewProps={{ showsVerticalScrollIndicator: false }}
      modalStyle={styles(theme).container}
      adjustToContentHeight>
      <BottomSheetHeader
        heading='Settings'
        subHeading='Themes and options'
      />
      <View style={styles().content}>
        <Option iconName='ios-color-palette'>
          <Checkbox
            labelBefore
            checked={isChecked}
            label='Dark Mode'
            onChange={onChange}
            labelStyle={styles(theme).label}
            checkedComponent={<MaterialIcons name='done' size={IconSizes.x6} color={ThemeStatic.accent} />}
            uncheckedComponent={<MaterialIcons name='done' size={IconSizes.x6} color={ThemeStatic.text02} />}
          />
        </Option>
        <Option
          label='About'
          iconName='ios-information-circle-outline'
          onPress={onAboutPress}
        />
        <Option
          label='Logout'
          iconName='ios-log-out'
          onPress={logOut}
        />
      </View>
    </Modalize>
  );
});

const styles = (theme = {} as ThemeColors) => StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: theme.base
  },
  content: {
    flex: 1,
    paddingTop: 20
  },
  label: {
    ...FontWeights.Light,
    ...FontSizes.Body,
    width: responsiveWidth(74),
    color: theme.text01
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6
  },
  optionLabel: {
    ...FontWeights.Light,
    ...FontSizes.Body,
    color: theme.text01,
    marginLeft: 10
  }
});

export default SettingsBottomSheet;