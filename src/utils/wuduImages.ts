import { ThemeType } from '../theme/colors.ts';

type WuduImageCollection = {
  [key: number]: any;
};

type WuduImagesProps = {
  light: WuduImageCollection;
  girl: WuduImageCollection;
};

export const wuduImages: WuduImagesProps = {
  light: {
    0: require('../../assets/images/wudhu/boy/wudu.png'),
    1: require('../../assets/images/wudhu/boy/1.png'),
    2: require('../../assets/images/wudhu/boy/2.png'),
    3: require('../../assets/images/wudhu/boy/3.png'),
    4: require('../../assets/images/wudhu/boy/4.png'),
    5: require('../../assets/images/wudhu/boy/5.png'),
    6: require('../../assets/images/wudhu/boy/6.png'),
    7: require('../../assets/images/wudhu/boy/7.png'),
    8: require('../../assets/images/wudhu/boy/8.png'),
    9: require('../../assets/images/wudhu/boy/9.png'),
  },
  girl: {
    0: require('../../assets/images/wudhu/girl/wudu.png'),
    1: require('../../assets/images/wudhu/girl/1-g.png'),
    2: require('../../assets/images/wudhu/girl/2-g.png'),
    3: require('../../assets/images/wudhu/girl/3-g.png'),
    4: require('../../assets/images/wudhu/girl/4-g.png'),
    5: require('../../assets/images/wudhu/girl/5-g.png'),
    6: require('../../assets/images/wudhu/girl/6-g.png'),
    7: require('../../assets/images/wudhu/girl/7-g.png'),
    8: require('../../assets/images/wudhu/girl/8-g.png'),
    9: require('../../assets/images/wudhu/girl/9-g.png'),
  },
};

export const getWuduImage = (theme: ThemeType, stepId: number) => {
  // 'light' theme uses boy images, 'girl' theme uses girl images
  const imageSet = theme === 'girl' ? 'girl' : 'light';
  return wuduImages[imageSet][stepId];
};
