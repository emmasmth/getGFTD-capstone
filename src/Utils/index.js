import { Dimensions, PixelRatio } from "react-native";
const Colors = {
    Red: '#CF3639',
    White: '#FFFFFF',
    Black: '#000000',
    Charcol: '#2F2E2E',
    Grey: '#6C6C6C',
    LightGrey: '#F4F3F3',
    LightestGrey: '#DFDFDF',
    Wheat: '#F7E6B7',
    GoldenD: '#DF9A05',
    GoldenL: '#F6B939',
    Green: '#3AB84F',
    Blue: '#0D58AC',
    // Blue: '#0080B1',
    LightBlue: '#0D58AC',
    // LightBlue: '#0b8abd',
    LightestBlue: '#002855',
    // LightestBlue: '#009EE2',
    DelightBlue: '#34b3e5',
    NavyBlue: '#193554',
    ParrotGreen: '#5ed34b',
    ThemeColor:'#002855',
    ProgressFillColor:"#0067E0",
    CardBottomColor:"#EFF6FF"

};


const US_STATES = [
    {
        id: 1,
        label: 'Alabama - AL',
        value: 'AL',

    },
    {
        id:2,
        label: 'Alaska - AK',
        value: 'AK'
    },
    {
        id:3,
        label: 'Arizona - AZ',
        value: 'AZ',
    },
    {
        id:4,
        label: 'Arkansas - AR',
        value: 'AR',
    },
    {
        id:5,
        label: 'California - CA',
        value: 'CA',
    },
    {
        id:6,
        label: 'Colorado - CO',
        value: 'CO',
    },
    {
        id:7,
        label: 'Connecticut - CT',
        value: 'CT',
    },
    {
        id:8,
        label: 'Delaware - DE',
        value: 'DE',
    },
    {
        id:9,
        label: 'Florida - FL',
        value: 'FL',
    },
    {
        id:10,
        label: 'Georgia - GA',
        value: 'GA',
    },
    {
        id:11,
        label: 'Hawaii - HI',
        value: 'HI',
    },
    {
        id:12,
        label: 'Idaho - ID',
        value: 'ID',
    },
    {
        id:13,
        label: 'Illinois - IL',
        value: 'IL',
    },
    {
        id:14,
        label: 'Indiana - IN',
        value: 'IN',
    },
    {
        id:15,
        label: 'Iowa -IA',
        value: 'IA',
    },
    {
        id:16,
        label: 'Kansas - KS',
        value: 'KS',
    },
    {
        id:17,
        label: 'Kentucky - KY',
        value: 'KY',
    },
    {
        id:18,
        label: 'Louisiana - LA',
        value: 'LA',
    },
    {
        id:19,
        label: 'Maine - ME',
        value: 'ME',
    },
    {
        id:20,
        label: 'Maryland - MD',
        value: 'MD',
    },
    {
        id:21,
        label: 'Massachusetts  - MA',
        value: 'MA',
    },
    {
        id:22,
        label: 'Michigan - MI',
        value: 'MI',
    },
    {
        id:23,
        label: 'Minnesota - MN',
        value: 'MN',
    },
    {
        id:24,
        label: 'Mississippi - MS',
        value: 'MS',
    },
    {
        id:25,
        label: 'Missouri - MO',
        value: 'MO',
    },
    {
        id:26,
        label: 'Montana - MT',
        value: 'MT',
    },
    {
        id:27,
        label: 'Nebraska - NE',
        value: 'NE',
    },
    {
        id:28,
        label: 'Nevada - NV',
        value: 'NV',
    },
    {
        id:29,
        label: 'New Hampshire - NH',
        value: 'NH',
    },
    {
        id:30,
        label: 'New Jersey - NJ',
        value: 'NJ',
    },
    {
        id:31,
        label: 'New Mexico - NM',
        value: 'NM',
    },
    {
        id:32,
        label: 'New York - NY',
        value: 'NY',
    },
    {
        id:33,
        label: 'North Carolina - NC',
        value: 'NC',
    },
    {
        id:34,
        label: 'North Dakota - ND',
        value: 'ND',
    },
    {
        id:35,
        label: 'Ohio - OH',
        value: 'OH',
    },
    {
        id:36,
        label: 'Oklahoma - OK',
        value: 'OK',
    },
    {
        id:37,
        label: 'Oregon - OR',
        value: 'OR',
    },
    {
        id:38,
        label: 'Pennsylvania - PA',
        value: 'PA',
    },
    {
        id:39,
        label: 'Rhode Island - RI',
        value: 'RI',
    },
    {
        id:40,
        label: 'South Carolina - SC',
        value: 'SC',
    },
    {
        id:41,
        label: 'South Dakota - SD',
        value: 'SD',
    },
    {
        id:42,
        label: 'Tennessee - TN',
        value: 'TN',
    },
    {
        id:43,
        label: 'Texas - TX',
        value: 'TX',
    },
    {
        id:44,
        label: 'Utah - UT',
        value: 'UT',
    },
    {
        id:45,
        label: 'Vermont - VT',
        value: 'VT',
    },
    {
        id:46,
        label: 'Virginia - VA',
        value: 'VA',
    },
    {
        id:47,
        label: 'Washington - WA',
        value: 'WA',
    },
    {
        id:48,
        label: 'West Virginia - WV',
        value: 'WV',
    },
    {
        id:49,
        label: 'Wisconsin - WI',
        value: 'WI',
    },
    {
        id:50,
        label: 'Wyoming - WY',
        value: 'WY',
    },
];

const { width, height } = Dimensions.get('window');

const widthToDp = number => {
    let givenWidth = typeof number === 'number' ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((width * givenWidth) / 100);
};
const heightToDp = number => {
    let givenHeight = typeof number === 'number' ? number : parseFloat(number);
    return PixelRatio.roundToNearestPixel((height * givenHeight) / 100);
};
const EMAIL_REGEX= /^[^\s@]+@[^\s@]+\.([^\s@]{2,})+$/;

export {
    Colors,
    widthToDp,
    heightToDp,
    US_STATES,
    EMAIL_REGEX,
};
