// src/utils/translations.ts

/**
 * Translation Types and Configuration
 */

// Define Translation Interface

export interface Translations {
  // Splash Screen
  appName: string;
  tagline: string;

  // Language & Theme Selection
  selectLanguage: string;
  selectTheme: string;
  boyTheme: string;
  girlTheme: string;
  continue: string;

  // Onboarding
  onboarding1Title: string;
  onboarding1Description: string;
  onboarding2Title: string;
  onboarding2Description: string;
  onboarding3Title: string;
  onboarding3Description: string;
  skip: string;
  next: string;
  getStarted: string;

  // Auth Screen
  welcomeTitle: string;
  welcomeSubtitle: string;
  continueAsGuest: string;
  signUp: string;
  signIn: string;
  createAccount: string;
  yourName: string;
  yourNamePlaceholder: string;
  yourEmail: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  signInButton: string;
  signUpButton: string;
  googleButton: string;
  forgotPassword: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  logInHere: string;
  signUpHere: string;
  letsGo: string;

  // Subscription Screen
  chooseYourPlan: string;
  planSubtitle: string;
  freePlan: string;
  freePlanFeatures: string[];
  monthlyPlan: string;
  monthlyPlanPrice: string;
  monthlyPlanFeatures: string[];
  yearlyPlan: string;
  yearlyPlanPrice: string;
  yearlyPlanSavings: string;
  yearlyPlanFeatures: string[];
  selectPlan: string;
  mostPopular: string;
  bestValue: string;

  // Home Screen
  greeting: string;
  todayProgress: string;
  readStories: string;
  azkarCompleted: string;
  daysStreak: string;
  exploreSections: string;
  prophetsTitle: string;
  prophetsDescription: string;
  companionsTitle: string;
  companionsDescription: string;
  azkarTitle: string;
  azkarDescription: string;

  // Learn Islam Section
  learnIslam: string;
  learnIslamDescription: string;
  arkanAlIslam: string;
  arkanAlIslamSubtitle: string;
  wuduTitle: string;
  wuduSubtitle: string;
  prayerTitle: string;
  prayerSubtitle: string;

  // Arkan al-Islam
  pillar: string;
  shahadah: string;
  shahadahTitle: string;
  shahadahDescription: string;
  shahadahArabic: string;

  salah: string;
  salahTitle: string;
  salahDescription: string;

  zakah: string;
  zakahTitle: string;
  zakahDescription: string;

  sawm: string;
  sawmTitle: string;
  sawmDescription: string;

  hajj: string;
  hajjTitle: string;
  hajjDescription: string;

  listenToExplanation: string;

  // Wudu Steps
  wuduIntro: string;
  stepNumber: string;
  intention: string;
  intentionDescription: string;
  washHands: string;
  washHandsDescription: string;
  rinseMouth: string;
  rinseMouthDescription: string;
  rinseNose: string;
  rinseNoseDescription: string;
  washFace: string;
  washFaceDescription: string;
  washArms: string;
  washArmsDescription: string;
  wipeHead: string;
  wipeHeadDescription: string;
  wipeEars: string;
  wipeEarsDescription: string;
  washFeet: string;
  washFeetDescription: string;
  wuduComplete: string;
  wuduCompleteMessage: string;
  startWudu: string;
  nextStep: string;
  previousStep: string;
  restart: string;
  wuduDua: string;

  // Prayer Steps
  prayerIntro: string;
  rakat: string;
  takbir: string;
  takbirDescription: string;
  standing: string;
  standingDescription: string;
  bowing: string;
  bowingDescription: string;
  standingAfterBowing: string;
  standingAfterBowingDescription: string;
  prostration: string;
  prostrationDescription: string;
  sitting: string;
  sittingDescription: string;
  secondProstration: string;
  secondProstrationDescription: string;
  tashahhud: string;
  tashahhudDescription: string;
  salam: string;
  salamDescription: string;
  prayerComplete: string;
  prayerCompleteMessage: string;
  startPrayer: string;
  unlockFullLessons: string;

  // Stories Section
  storiesOfProphets: string;
  storiesOfCompanions: string;
  back: string;
  min: string;
  read: string;
  locked: string;
  unlockWithPremium: string;
  upgradeToRead: string;
  upgradeToPremium: string;

  // Story Detail
  listenToStory: string;
  pause: string;
  play: string;

  // Azkar Screen
  dailyAzkar: string;
  morning: string;
  evening: string;
  beforeSleep: string;
  afterPrayer: string;
  times: string;
  completed: string;
  tapToRecite: string;

  // Profile Screen
  myProfile: string;
  achievements: string;
  storiesRead: string;
  totalAzkar: string;
  learningStreak: string;
  days: string;
  earnedBadges: string;
  firstStory: string;
  readYourFirstStory: string;
  weekWarrior: string;
  sevenDaysStreak: string;
  azkarMaster: string;
  completed100Azkar: string;
  prophetScholar: string;
  readAllProphetStories: string;

  // Settings Screen
  settings: string;
  upgradeToPremiumTitle: string;
  unlockAllStories: string;
  premiumMember: string;
  active: string;
  thankYou: string;
  language: string;
  english: string;
  arabic: string;
  theme: string;
  boyThemeLabel: string;
  girlThemeLabel: string;
  darkMode: string;
  darkThemeEnabled: string;
  lightThemeEnabled: string;
  soundEffects: string;
  soundEnabled: string;
  soundDisabled: string;
  notifications: string;
  getDailyReminders: string;
  noReminders: string;
  aboutApp: string;
  version: string;
  appDescription: string;

  // Bottom Navigation
  home: string;
  stories: string;
  azkar: string;
  profile: string;

  // Quran Reading Screen
  quranReading: string;
  quranPractice: string;
  selectSurah: string;
  surahAlFatiha: string;
  surahAlIkhlas: string;
  surahAlFalaq: string;
  surahAnNas: string;
  startRecording: string;
  recording: string;
  stopRecording: string;
  analyzing: string;
  excellentRecitation: string;
  goodJob: string;
  tryAgain: string;
  makeSoundSoft: string;
  showTranslation: string;
  hideTranslation: string;
  longPressTafsir: string;
  tafsirTitle: string;
  close: string;
  unlockQuran: string;
  lockedSurah: string;
  tryAnotherVerse: string;
  playAudio: string;
  rewardMessage: string;
}

// ============================================
// Translation Data
// ============================================
export const translations: Record<'en' | 'ar', Translations> = {
  en: {
    // Splash Screen
    appName: 'Little Believers',
    tagline: 'Learning Islam with Love',

    // Language & Theme Selection
    selectLanguage: 'Select Your Language',
    selectTheme: 'Choose Your Theme',
    boyTheme: 'Boy Theme',
    girlTheme: 'Girl Theme',
    continue: 'Continue',

    // Onboarding
    onboarding1Title: 'Stories of the Prophets',
    onboarding1Description:
      'Learn about the brave messengers of Allah through engaging stories and beautiful illustrations',
    onboarding2Title: 'Stories of the Companions',
    onboarding2Description:
      'Discover the inspiring lives of the Sahabah and how they followed the Prophet ﷺ',
    onboarding3Title: 'Daily Azkar & Duas',
    onboarding3Description:
      'Build good habits with daily remembrance and beautiful prayers for every moment',
    skip: 'Skip',
    next: 'Next',
    getStarted: 'Get Started',

    // Auth Screen
    welcomeTitle: 'As-salamu Alaykum!',
    welcomeSubtitle: 'Join us on an amazing adventure to learn about Islam!',
    continueAsGuest: 'Continue as Guest 🌙',
    signUp: 'Sign Up',
    signIn: 'Log In',
    createAccount: 'Create Account',
    yourName: 'Your Name',
    yourNamePlaceholder: 'Enter your name',
    yourEmail: 'Your Email',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    signInButton: 'Log In',
    signUpButton: 'Create Account',
    googleButton: 'Continue with Google ',
    forgotPassword: 'Forgot Password?',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    logInHere: 'Log In',
    signUpHere: 'Sign Up',
    letsGo: "Let's Go!",

    // Subscription Screen
    chooseYourPlan: 'Choose Your Plan',
    planSubtitle: 'Unlock all stories and features',
    freePlan: 'Free Plan',
    freePlanFeatures: [
      'First 3 Prophet Stories',
      'First 3 Companion Stories',
      'Basic Daily Azkar',
    ],
    monthlyPlan: 'Monthly Plan',
    monthlyPlanPrice: '50 EGP/month',
    monthlyPlanFeatures: [
      'All Prophet Stories',
      'All Companion Stories',
      'Complete Azkar & Duas',
      'Offline Access',
      'No Ads',
    ],
    yearlyPlan: 'Yearly Plan',
    yearlyPlanPrice: '500 EGP/year',
    yearlyPlanSavings: 'Save 100 EGP!',
    yearlyPlanFeatures: [
      'All Monthly Features',
      'Early Access to New Content',
      'Priority Support',
      'Special Badges & Rewards',
    ],
    selectPlan: 'Select Plan',
    mostPopular: 'Most Popular',
    bestValue: 'Best Value',

    // Home Screen
    greeting: 'As-salamu Alaykum',
    todayProgress: "Today's Progress",
    readStories: 'Stories Read',
    azkarCompleted: 'Azkar Completed',
    daysStreak: 'Days Streak',
    exploreSections: 'Explore & Learn',
    prophetsTitle: 'Stories of the Prophets',
    prophetsDescription: "Learn about Allah's messengers",
    companionsTitle: 'Stories of the Companions',
    companionsDescription: 'Discover the brave Sahabah',
    azkarTitle: 'Daily Azkar & Duas',
    azkarDescription: 'Daily prayers and remembrance',

    // Learn Islam Section
    learnIslam: 'Learn Islam',
    learnIslamDescription: 'Discover the foundations of faith',
    arkanAlIslam: 'Arkan al-Islam',
    arkanAlIslamSubtitle: 'The Five Pillars of Islam',
    wuduTitle: 'Wudu (Ablution)',
    wuduSubtitle: 'Learn how to perform wudu',
    prayerTitle: 'How to Pray',
    prayerSubtitle: 'Step-by-step guide to Salah',

    // Stories Section
    storiesOfProphets: 'Stories of the Prophets',
    storiesOfCompanions: 'Stories of the Companions',
    back: 'Back',
    min: 'min',
    read: 'Read',
    locked: 'Locked',
    unlockWithPremium: 'Unlock with Premium',
    upgradeToRead: 'Upgrade to Premium to read this story',
    upgradeToPremium: 'Upgrade to Premium',

    // Story Detail
    listenToStory: 'Listen to Story',
    pause: 'Pause',
    play: 'Play',

    // Azkar Screen
    dailyAzkar: 'Daily Azkar & Duas',
    morning: 'Morning',
    evening: 'Evening',
    beforeSleep: 'Before Sleep',
    afterPrayer: 'After Prayer',
    times: 'times',
    completed: 'Completed!',
    tapToRecite: 'Tap to recite',

    // Profile Screen
    myProfile: 'My Profile',
    achievements: 'Achievements',
    storiesRead: 'Stories Read',
    totalAzkar: 'Total Azkar',
    learningStreak: 'Learning Streak',
    days: 'days',
    earnedBadges: 'Earned Badges',
    firstStory: 'First Story',
    readYourFirstStory: 'Read your first story',
    weekWarrior: 'Week Warrior',
    sevenDaysStreak: '7 days streak',
    azkarMaster: 'Azkar Master',
    completed100Azkar: 'Completed 100 azkar',
    prophetScholar: 'Prophet Scholar',
    readAllProphetStories: 'Read all prophet stories',

    // Settings Screen
    settings: 'Settings',
    upgradeToPremiumTitle: 'Upgrade to Premium',
    unlockAllStories: 'Unlock all stories & features',
    premiumMember: 'Premium Member',
    active: 'Active',
    thankYou: '✨ Thank you for your support!',
    language: 'Language',
    english: 'English',
    arabic: 'العربية',
    theme: 'Theme',
    boyThemeLabel: 'Boy Theme 💙',
    girlThemeLabel: 'Girl Theme 💖',
    darkMode: 'Dark Mode',
    darkThemeEnabled: 'Dark theme enabled',
    lightThemeEnabled: 'Light theme enabled',
    soundEffects: 'Sound Effects',
    soundEnabled: 'Sound enabled',
    soundDisabled: 'Sound disabled',
    notifications: 'Notifications',
    getDailyReminders: 'Get daily reminders',
    noReminders: 'No reminders',
    aboutApp: 'About Little Believers',
    version: 'Version 1.0.0',
    appDescription:
      'An Islamic educational app to help children learn about their faith in a fun and engaging way.',

    // Bottom Navigation
    home: 'Home',
    stories: 'Stories',
    azkar: 'Azkar',
    profile: 'Profile',

    // Quran Reading Screen
    quranReading: "Qur'an Reading",
    quranPractice: "Practice Qur'an Reading",
    selectSurah: 'Select a Surah',
    surahAlFatiha: 'Al-Fatiha',
    surahAlIkhlas: 'Al-Ikhlas',
    surahAlFalaq: 'Al-Falaq',
    surahAnNas: 'An-Nas',
    startRecording: 'Tap to Start Recording',
    recording: 'Recording...',
    stopRecording: 'Tap to Stop',
    analyzing: 'Analyzing your recitation...',
    excellentRecitation: 'Excellent recitation! Keep it up! ⭐',
    goodJob: 'Good job! Try again to improve! 👍',
    tryAgain: 'Try again on the word',
    makeSoundSoft: 'make the sound soft',
    showTranslation: 'Show Translation',
    hideTranslation: 'Hide Translation',
    longPressTafsir: 'Long press any verse for Tafsir',
    tafsirTitle: 'Tafsir (Explanation)',
    close: 'Close',
    unlockQuran:
      "Unlock full Qur'an reading with your AI helper for only 50 EGP/month 🌙",
    lockedSurah: 'This Surah is locked',
    tryAnotherVerse: 'Try Another Verse',
    playAudio: 'Play Audio',
    rewardMessage: 'Amazing! You earned a star! ⭐',

    // Learn Islam Section
    // Arkan al-Islam
    pillar: 'Pillar',
    shahadah: 'Shahadah',
    shahadahTitle: 'Declaration of Faith',
    shahadahDescription:
      'Testify that there is no god but Allah, and Muhammad ﷺ is His messenger',
    shahadahArabic:
      'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ',

    salah: 'Salah',
    salahTitle: 'Prayer',
    salahDescription: 'Pray five times daily to connect with Allah',

    zakah: 'Zakah',
    zakahTitle: 'Charity',
    zakahDescription: 'Give to those in need and purify your wealth',

    sawm: 'Sawm',
    sawmTitle: 'Fasting',
    sawmDescription: 'Fast during the month of Ramadan from dawn to sunset',

    hajj: 'Hajj',
    hajjTitle: 'Pilgrimage',
    hajjDescription: 'Make pilgrimage to Makkah once in your lifetime if able',

    listenToExplanation: 'Listen to Explanation',

    // Wudu Steps
    wuduIntro:
      "Wudu is the washing that Muslims do before prayer. Let's learn the steps!",
    stepNumber: 'Step',
    intention: 'Intention (Niyyah)',
    intentionDescription:
      'Make the intention in your heart to perform wudu for prayer',
    washHands: 'Wash Hands',
    washHandsDescription: 'Wash both hands up to the wrists three times',
    rinseMouth: 'Rinse Mouth',
    rinseMouthDescription: 'Rinse your mouth three times',
    rinseNose: 'Rinse Nose',
    rinseNoseDescription:
      'Sniff water into your nose and blow it out three times',
    washFace: 'Wash Face',
    washFaceDescription: 'Wash your entire face three times',
    washArms: 'Wash Arms',
    washArmsDescription:
      'Wash your right arm up to the elbow three times, then your left arm',
    wipeHead: 'Wipe Head',
    wipeHeadDescription: 'Wipe your wet hands over your head once',
    wipeEars: 'Wipe Ears',
    wipeEarsDescription: 'Wipe inside and behind your ears with wet fingers',
    washFeet: 'Wash Feet',
    washFeetDescription:
      'Wash your right foot up to the ankle three times, then your left foot',
    wuduComplete: 'Wudu Complete! ⭐',
    wuduCompleteMessage: "Great job! You've completed all the steps of wudu!",
    startWudu: 'Start Wudu Practice',
    nextStep: 'Next Step',
    previousStep: 'Previous Step',
    restart: 'Restart',
    wuduDua:
      "Ash-hadu an la ilaha illallah, wahdahu la sharika lah, wa ash-hadu anna Muhammadan 'abduhu wa rasuluh",

    // Prayer Steps
    prayerIntro:
      'Learn how to perform Salah, the Islamic prayer. Follow each step carefully!',
    rakat: 'Rakat',
    takbir: 'Takbir',
    takbirDescription:
      "Raise your hands and say 'Allahu Akbar' (Allah is the Greatest)",
    standing: 'Standing (Qiyam)',
    standingDescription: 'Stand straight and recite Al-Fatiha',
    bowing: 'Bowing (Ruku)',
    bowingDescription:
      "Bow down and say 'Subhana Rabbiyal Adheem' (Glory to my Lord, the Most Great)",
    standingAfterBowing: 'Standing After Bowing',
    standingAfterBowingDescription:
      "Stand up and say 'Sami Allahu liman hamidah' (Allah hears those who praise Him)",
    prostration: 'Prostration (Sujud)',
    prostrationDescription:
      "Prostrate and say 'Subhana Rabbiyal A'la' (Glory to my Lord, the Most High)",
    sitting: 'Sitting Between Prostrations',
    sittingDescription: 'Sit between the two prostrations',
    secondProstration: 'Second Prostration',
    secondProstrationDescription:
      "Prostrate again saying 'Subhana Rabbiyal A'la'",
    tashahhud: 'Tashahhud',
    tashahhudDescription: 'Sit and recite the Tashahhud',
    salam: 'Tasleem',
    salamDescription:
      "Turn your head right and left saying 'As-salamu alaykum wa rahmatullah'",
    prayerComplete: 'Prayer Complete! ⭐',
    prayerCompleteMessage: "Excellent! You've learned how to pray!",
    startPrayer: 'Start Prayer Practice',
    unlockFullLessons:
      'Unlock all lessons with Premium for only 50 EGP/month! 🌟',
  },

  ar: {
    // Splash Screen
    appName: 'المؤمنون الصغير',
    tagline: 'نتعلم الإسلام بحب',

    // Language & Theme Selection
    selectLanguage: 'اختر لغتك',
    selectTheme: 'اختر المظهر',
    boyTheme: 'مظهر الأولاد',
    girlTheme: 'مظهر البنات',
    continue: 'متابعة',

    // Onboarding
    onboarding1Title: 'قصص الأنبياء',
    onboarding1Description:
      'تعلم عن رسل الله الشجعان من خلال قصص مشوقة ورسوم جميلة',
    onboarding2Title: 'قصص الصحابة',
    onboarding2Description: 'اكتشف حياة الصحابة الملهمة وكيف اتبعوا النبي ﷺ',
    onboarding3Title: 'الأذكار والأدعية اليومية',
    onboarding3Description:
      'ابنِ عادات جيدة مع الذكر اليومي والدعاء الجميل لكل لحظة',
    skip: 'تخطي',
    next: 'التالي',
    getStarted: 'ابدأ الآن',

    // Auth Screen
    welcomeTitle: 'السلام عليكم!',
    welcomeSubtitle: 'انضم إلينا في مغامرة رائعة لتعلم الإسلام!',
    continueAsGuest: 'متابعة كضيف 🌙',
    signUp: 'إنشاء حساب',
    signIn: 'تسجيل الدخول',
    createAccount: 'إنشاء حساب',
    yourName: 'اسمك',
    yourNamePlaceholder: 'أدخل اسمك',
    yourEmail: 'بريدك الإلكتروني',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'بريدك الإلكتروني',
    password: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    confirmPasswordPlaceholder: 'أعد إدخال كلمة المرور',
    signInButton: 'تسجيل الدخول',
    signUpButton: 'إنشاء حساب',
    googleButton: 'التسجيل بإستخدام جوجل',
    forgotPassword: 'نسيت كلمة المرور؟',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    logInHere: 'تسجيل الدخول',
    signUpHere: 'إنشاء حساب',
    letsGo: 'هيا بنا!',

    // Subscription Screen
    chooseYourPlan: 'اختر خطتك',
    planSubtitle: 'افتح جميع القصص والميزات',
    freePlan: 'الخطة المجانية',
    freePlanFeatures: [
      'أول 3 قصص أنبياء',
      'أول 3 قصص صحابة',
      'أذكار يومية أساسية',
    ],
    monthlyPlan: 'الخطة الشهرية',
    monthlyPlanPrice: '50 جنيه/شهر',
    monthlyPlanFeatures: [
      'جميع قصص الأنبياء',
      'جميع قصص الصحابة',
      'أذكار وأدعية كاملة',
      'الوصول دون إنترنت',
      'بدون إعلانات',
    ],
    yearlyPlan: 'الخطة السنوية',
    yearlyPlanPrice: '500 جنيه/سنة',
    yearlyPlanSavings: 'وفر 100 جنيه!',
    yearlyPlanFeatures: [
      'جميع مميزات الخطة الشهرية',
      'وصول مبكر للمحتوى الجديد',
      'دعم ذو أولوية',
      'شارات ومكافآت خاصة',
    ],
    selectPlan: 'اختر الخطة',
    mostPopular: 'الأكثر شعبية',
    bestValue: 'أفضل قيمة',

    // Home Screen
    greeting: 'السلام عليكم',
    todayProgress: 'تقدم اليوم',
    readStories: 'قصص مقروءة',
    azkarCompleted: 'أذكار مكتملة',
    daysStreak: 'أيام متتالية',
    exploreSections: 'استكشف وتعلم',
    prophetsTitle: 'قصص الأنبياء',
    prophetsDescription: 'تعلم عن رسل الله',
    companionsTitle: 'قصص الصحابة',
    companionsDescription: 'اكتشف الصحابة الشجعان',
    azkarTitle: 'الأذكار والأدعية اليومية',
    azkarDescription: 'أدعية وذكر يومي',

    // Learn Islam Section
    learnIslam: 'تعلم الإسلام',
    learnIslamDescription: 'اكتشف أسس العقيدة',
    arkanAlIslam: 'أركان الإسلام',
    arkanAlIslamSubtitle: 'أركان الإسلام الخمسة',
    wuduTitle: 'الوضوء',
    wuduSubtitle: 'تعلم كيفية الوضوء',
    prayerTitle: 'كيفية الصلاة',
    prayerSubtitle: 'دليل خطوة بخطوة لأداء الصلاة',

    // Stories Section
    storiesOfProphets: 'قصص الأنبياء',
    storiesOfCompanions: 'قصص الصحابة',
    back: 'رجوع',
    min: 'دقيقة',
    read: 'اقرأ',
    locked: 'مقفل',
    unlockWithPremium: 'افتح بالاشتراك المميز',
    upgradeToRead: 'قم بالترقية للاشتراك المميز لقراءة هذه القصة',
    upgradeToPremium: 'الترقية للاشتراك المميز',

    // Story Detail
    listenToStory: 'استمع للقصة',
    pause: 'إيقاف مؤقت',
    play: 'تشغيل',

    // Azkar Screen
    dailyAzkar: 'الأذكار والأدعية اليومية',
    morning: 'الصباح',
    evening: 'المساء',
    beforeSleep: 'قبل النوم',
    afterPrayer: 'بعد الصلاة',
    times: 'مرات',
    completed: 'مكتمل!',
    tapToRecite: 'اضغط للقراءة',

    // Profile Screen
    myProfile: 'ملفي الشخصي',
    achievements: 'الإنجازات',
    storiesRead: 'قصص مقروءة',
    totalAzkar: 'إجمالي الأذكار',
    learningStreak: 'أيام التعلم المتتالية',
    days: 'أيام',
    earnedBadges: 'الشارات المكتسبة',
    firstStory: 'القصة الأولى',
    readYourFirstStory: 'قراءة أول قصة',
    weekWarrior: 'محارب الأسبوع',
    sevenDaysStreak: '7 أيام متتالية',
    azkarMaster: 'أستاذ الأذكار',
    completed100Azkar: 'إكمال 100 ذكر',
    prophetScholar: 'عالم الأنبياء',
    readAllProphetStories: 'قراءة جميع قصص الأنبياء',

    // Settings Screen
    settings: 'الإعدادات',
    upgradeToPremiumTitle: 'الترقية للاشتراك المميز',
    unlockAllStories: 'افتح جميع القصص والميزات',
    premiumMember: 'عضو مميز',
    active: 'نشط',
    thankYou: '✨ شكراً لدعمك!',
    language: 'اللغة',
    english: 'English',
    arabic: 'العربية',
    theme: 'المظهر',
    boyThemeLabel: 'مظهر الأولاد 💙',
    girlThemeLabel: 'مظهر البنات 💖',
    darkMode: 'الوضع الداكن',
    darkThemeEnabled: 'الوضع الداكن مفعل',
    lightThemeEnabled: 'الوضع الفاتح مفعل',
    soundEffects: 'المؤثرات الصوتية',
    soundEnabled: 'الصوت مفعل',
    soundDisabled: 'الصوت معطل',
    notifications: 'الإشعارات',
    getDailyReminders: 'احصل على تذكيرات يومية',
    noReminders: 'لا توجد تذكيرات',
    aboutApp: 'عن المؤمنون الصغار',
    version: 'الإصدار 1.0.0',
    appDescription:
      'تطبيق إسلامي تعليمي لمساعدة الأطفال على التعلم عن دينهم بطريقة ممتعة وجذابة.',

    // Bottom Navigation
    home: 'الرئيسية',
    stories: 'القصص',
    azkar: 'الأذكار',
    profile: 'الملف الشخصي',

    // Quran Reading Screen
    quranReading: 'قراءة القرآن',
    quranPractice: 'تمرّن على قراءة القرآن',
    selectSurah: 'اختر سورة',
    surahAlFatiha: 'الفاتحة',
    surahAlIkhlas: 'الإخلاص',
    surahAlFalaq: 'الفلق',
    surahAnNas: 'الناس',
    startRecording: 'اضغط لبدء التسجيل',
    recording: 'جاري التسجيل...',
    stopRecording: 'اضغط للإيقاف',
    analyzing: 'جاري تحليل قراءتك...',
    excellentRecitation: 'قراءة ممتازة! استمر! ⭐',
    goodJob: 'أحسنت! حاول مرة أخرى للتحسين! 👍',
    tryAgain: 'حاول مرة أخرى على الكلمة',
    makeSoundSoft: 'اجعل الصوت ناعماً',
    showTranslation: 'إظهار الترجمة',
    hideTranslation: 'إخفاء الترجمة',
    longPressTafsir: 'اضغط مطولاً على أي آية للتفسير',
    tafsirTitle: 'التفسير',
    close: 'إغلاق',
    unlockQuran:
      'افتح قراءة القرآن الكاملة مع مساعد الذكاء الاصطناعي مقابل 50 جنيه/شهر فقط 🌙',
    lockedSurah: 'هذه السورة مقفلة',
    tryAnotherVerse: 'جرب آية أخرى',
    playAudio: 'تشغيل الصوت',
    rewardMessage: 'رائع! لقد حصلت على نجمة! ⭐',

    // Learn Islam Section
    // Arkan al-Islam
    pillar: 'الركن',
    shahadah: 'الشهادة',
    shahadahTitle: 'شهادة أن لا إله إلا الله',
    shahadahDescription: 'أشهد أن لا إله إلا الله وأن محمداً رسول الله',
    shahadahArabic:
      'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ',

    salah: 'الصلاة',
    salahTitle: 'الصلاة',
    salahDescription: 'صلِّ خمس مرات يومياً للتواصل مع الله',

    zakah: 'الزكاة',
    zakahTitle: 'الزكاة',
    zakahDescription: 'أعطِ المحتاجين وطهّر مالك',

    sawm: 'الصوم',
    sawmTitle: 'صوم رمضان',
    sawmDescription: 'صُم خلال شهر رمضان من الفجر إلى الغروب',

    hajj: 'الحج',
    hajjTitle: 'الحج',
    hajjDescription: 'قم بالحج إلى مكة مرة في حياتك إذا استطعت',

    listenToExplanation: 'استمع للشرح',

    // Wudu Steps
    wuduIntro:
      'الوضوء هو الغسل الذي يقوم به المسلمون قبل الصلاة. لنتعلم الخطوات!',
    stepNumber: 'الخطوة',
    intention: 'النية',
    intentionDescription: 'انوِ في قلبك أداء الوضوء للصلاة',
    washHands: 'غسل اليدين',
    washHandsDescription: 'اغسل كلتا يديك إلى الرسغين ثلاث مرات',
    rinseMouth: 'المضمضة',
    rinseMouthDescription: 'تمضمض ثلاث مرات',
    rinseNose: 'الاستنشاق',
    rinseNoseDescription: 'استنشق الماء في أنفك ثم انفخه ثلاث مرات',
    washFace: 'غسل الوجه',
    washFaceDescription: 'اغسل وجهك كاملاً ثلاث مرات',
    washArms: 'غسل الذراعين',
    washArmsDescription:
      'اغسل ذراعك الأيمن إلى المرفق ثلاث مرات، ثم ذراعك الأيسر',
    wipeHead: 'مسح الرأس',
    wipeHeadDescription: 'امسح على رأسك بيديك المبللتين مرة واحدة',
    wipeEars: 'مسح الأذنين',
    wipeEarsDescription: 'امسح داخل وخلف أذنيك بأصابع مبللة',
    washFeet: 'غسل القدمين',
    washFeetDescription:
      'اغسل قدمك اليمنى إلى الكعبين ثلاث مرات، ثم قدمك اليسرى',
    wuduComplete: 'اكتمل الوضوء! ⭐',
    wuduCompleteMessage: 'أحسنت! لقد أكملت جميع خطوات الوضوء!',
    startWudu: 'ابدأ تمرين الوضوء',
    nextStep: 'الخطوة التالية',
    previousStep: 'الخطوة السابقة',
    restart: 'ابدأ من جديد',
    wuduDua:
      'أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',

    // Prayer Steps
    prayerIntro: 'تعلم كيفية أداء الصلاة. اتبع كل خطوة بعناية!',
    rakat: 'ركعة',
    takbir: 'التكبير',
    takbirDescription: "ارفع يديك وقل 'الله أكبر'",
    standing: 'القيام',
    standingDescription: 'قف معتدلاً واقرأ الفاتحة',
    bowing: 'الركوع',
    bowingDescription: "اركع وقل 'سبحان ربي العظيم'",
    standingAfterBowing: 'القيام من الركوع',
    standingAfterBowingDescription: "قف وقل 'سمع الله لمن حمده'",
    prostration: 'السجود',
    prostrationDescription: "اسجد وقل 'سبحان ربي الأعلى'",
    sitting: 'الجلوس بين السجدتين',
    sittingDescription: 'اجلس بين السجدتين',
    secondProstration: 'السجدة الثانية',
    secondProstrationDescription: "اسجد مرة أخرى قائلاً 'سبحان ربي الأعلى'",
    tashahhud: 'التشهد',
    tashahhudDescription: 'اجلس واقرأ التشهد',
    salam: 'التسليم',
    salamDescription: "التفت يميناً ويساراً قائلاً 'السلام عليكم ورحمة الله'",
    prayerComplete: 'اكتملت الصلاة! ⭐',
    prayerCompleteMessage: 'ممتاز! لقد تعلمت كيفية الصلاة!',
    startPrayer: 'ابدأ تمرين الصلاة',
    unlockFullLessons:
      'افتح جميع الدروس مع الاشتراك المميز مقابل 50 جنيه/شهر فقط! 🌟',
  },
};

// ============================================
// Helper Functions
// ============================================

export type Language = keyof typeof translations;

/**
 * Get translations for a specific language
 * Returns type-safe translation object
 */
export const getTranslation = (lang: Language): Translations => {
  return translations[lang] || translations.en;
};
