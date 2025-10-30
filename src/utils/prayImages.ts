import { ThemeType } from '../theme/colors.ts';

type PrayImagesCollection = {
  [key: string]: any;
};

type PrayImagesProps = {
  light: PrayImagesCollection;
  girl: PrayImagesCollection;
};

export const prayImages: PrayImagesProps = {
  light: {
    0: require('../../assets/images/pray/boy/1.png'),
    1: require('../../assets/images/pray/boy/2.png'),
    2: require('../../assets/images/pray/boy/3.png'),
    3: require('../../assets/images/pray/boy/4.png'),
    4: require('../../assets/images/pray/boy/5.png'),
    5: require('../../assets/images/pray/boy/6.png'),
    6: require('../../assets/images/pray/boy/7.png'),
    7: require('../../assets/images/pray/boy/8.png'),
    8: require('../../assets/images/pray/boy/9.png'),
    9: require('../../assets/images/pray/boy/10.png'),
    10: require('../../assets/images/pray/boy.png'),
  },
  girl: {
    0: require('../../assets/images/pray/girl/1.png'),
    1: require('../../assets/images/pray/girl/2.png'),
    2: require('../../assets/images/pray/girl/3.png'),
    3: require('../../assets/images/pray/girl/4.png'),
    4: require('../../assets/images/pray/girl/5.png'),
    5: require('../../assets/images/pray/girl/6.png'),
    6: require('../../assets/images/pray/girl/7.png'),
    7: require('../../assets/images/pray/girl/8.png'),
    8: require('../../assets/images/pray/girl/9.png'),
    9: require('../../assets/images/pray/girl/10.png'),
    10: require('../../assets/images/pray/girl.png'),
  },
};

export const getPrayImage = (theme: ThemeType, stepId: number) => {
  const imageSet = theme === 'girl' ? 'girl' : 'light';
  return prayImages[imageSet][stepId];
};
