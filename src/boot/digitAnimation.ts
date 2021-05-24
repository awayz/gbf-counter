import { boot } from 'quasar/wrappers';
import VueDigitAnimation from 'vue-digit-animation';

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(VueDigitAnimation);
});
