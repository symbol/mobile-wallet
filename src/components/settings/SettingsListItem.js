import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import { Switch } from 'react-native-switch';
import GlobalStyles from '@src/styles/GlobalStyles';
import styles from './SettingsListItem.styl';

type Props = {
	title: string,
	icon: any,
	itemValue?: string | boolean,
	rightIcon?: ?number,
	onPress?: () => void | null,
	onValueChange?: (value: boolean) => void,
};

const selector = (value, icon) => (
	<View style={styles.dropDownSelector}>
		<Text style={styles.dropDownSelectorText}>
			{
				((value).length > 20) ?
					(((value).substring(0, 20 - 3)) + '...') :
					value
			}
		</Text>
		<Image 
			source={require('@src/assets/icons/ic-chevron-down-white.png')} 
			style={styles.dropDownSelectorIcon} 
		/>
	</View>
);


export default class SettingsListItem extends Component<Props> {
	render() {
		const {
			icon,
			title,
			isSwitch,
			isSelector,
			isDropdown,
			itemValue,
			color,
			onPress,
			onValueChange
		} = this.props;

		const ViewComponent = isDropdown
			? View
			: TouchableOpacity;

		return (
			<ViewComponent onPress={onPress} style={styles.itemContainer}>
				<View style={styles.itemTitle}>
					{/* <Image source={icon} style={styles.itemIcon} /> */}
					<Text style={[styles.itemTitleText, { color: color || '#fff' }]}>{title}</Text>
				</View>
				{isSelector && selector(itemValue)}
				{isSwitch && (
					<Switch 
					onValueChange={onValueChange} 
					value={Boolean(itemValue)} 
					activeText={' '}
					inActiveText={' '}
					circleSize={17}
					barHeight={20}
					switchWidthMultiplier={2.2} 
					switchLeftPx={4}
					switchRightPx={4}
					circleBorderWidth={0}
					backgroundActive={GlobalStyles.color.WHITE}
					backgroundInactive={GlobalStyles.color.WHITE}
					circleActiveColor={GlobalStyles.color.PINK}
					circleInActiveColor={GlobalStyles.color.SECONDARY} 
					/>
				)}
			</ViewComponent>
		);
	}
}
