import { Directions } from "react-native-gesture-handler";

/**
 * Symbol branding colors
 */
const COLORS = {
	PRIMARY: '#5200c6',
	SECONDARY:'#44004e',
	PINK: '#ff00ff',
	BLUE: '#00c8ff',
	GREEN: '#33dd50',
	RED: '#dd3350',
	ORANGE: '#ff9600',
	BLACK: '#000000',
	GREY1:'#333333',
	GREY2:'#666666',
	GREY3:'#999999',
	GREY4:'#cccccc',
	GREY5:'#f2f2f2',
	DARKWHITE: '#f3f4f8',
	WHITE: '#ffffff'
};

export default {
	color: {
		// Brand colors
		...COLORS,

		// On Light Background
		onLight: {
			TITLE: COLORS.PINK,
			TEXT: COLORS.SECONDARY,

			BUTTON: COLORS.PRIMARY,
			BUTTON_DISABLED: COLORS.PRIMARY,
			BUTTON_TEXT: COLORS.WHITE,
			BUTTON_TEXT_DISABLED: COLORS.WHITE,
			CONTROL: COLORS.PRIMARY,
			CONTROL_ACTIVE: COLORS.PRIMARY,
			CONTROL_DISABLED: COLORS.PRIMARY,
			CONTROL_TEXT: COLORS.WHITE,
			CONTROL_TEXT_ACTIVE: COLORS.WHITE,
			CONTROL_TEXT_DISABLED: COLORS.WHITE,
		},

		// On Dark Background
		onDark: {
			TITLE: COLORS.WHITE,
			TEXT: COLORS.WHITE,

			BUTTON: COLORS.PINK,
			BUTTON_DISABLED: COLORS.PRIMARY,
			BUTTON_TEXT: COLORS.WHITE,
			BUTTON_TEXT_DISABLED: COLORS.WHITE,
			CONTROL: COLORS.PRIMARY,
			CONTROL_ACTIVE: COLORS.PRIMARY,
			CONTROL_DISABLED: COLORS.PRIMARY,
			CONTROL_TEXT: COLORS.WHITE,
			CONTROL_TEXT_ACTIVE: COLORS.WHITE,
			CONTROL_TEXT_DISABLED: COLORS.WHITE,
		},
	},

	text: {
		title: {
			color: COLORS.WHITE,
			fontFamily: 'NotoSans-SemiBold',
			fontWeight: '100',
			fontSize: 24
		},

		titleSmall: {
			color: COLORS.WHITE,
			fontFamily: 'NotoSans-SemiBold',
			fontWeight: '400',
			fontSize: 18
		},

		subtitle: {
			color: COLORS.DARKWHITE,
			fontFamily: 'NotoSans-Regular',
			fontSize: 12,
			lineHeight: 22,
			opacity: 0.6,
		},

		regular: {
			color: COLORS.DARKWHITE,
			fontFamily: 'NotoSans-Regular',
			fontSize: 12,
			lineHeight: 22,
			opacity: 0.6,
			
		},

		bold: {
			color: COLORS.WHITE,
			fontFamily: 'NotoSans-SemiBold',
			fontWeight: '100',
			fontSize: 13,
			lineHeight: 22,
		},

		alert: {
			color: COLORS.WHITE,
			fontFamily: 'NotoSans-Bold',
			fontWeight: '100',
			fontSize: 38,
			lineHeight: 43,
			paddingBottom: 8,
			paddingTop: 16,
		},
	},

	section: {
		title: {
			paddingLeft: 34,
			paddingRight: 34
		},

		text: {
			paddingLeft: 34,
			paddingRight: 34
		},

		list: {
			paddingLeft: 34,
			paddingRight: 34,
		},

		center: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center'
		},

		form: {
			paddingLeft: 34,
			paddingRight: 34,
			paddingBottom: 17,
			flex: 1,
			flexDirection: 'column'
		},

		formItem: {
			paddingBottom: 17
		},

		formBottom: {
			marginTop: 'auto',
			paddingTop: 17,
			paddingBottom: 17
		}
	},

	menu: {
		icon: {

		}
	},

	controls: {
		shadow: {
			zIndex: 0,
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 0 },
			shadowOpacity: 0.2,
			shadowRadius: 10,
			elevation: 7,
			position: 'absolute',
			backgroundColor: '#fff',
			height: '100%',
			width: '100%',
			opacity: 0.1
		}
	}
};
