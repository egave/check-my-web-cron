import { Fluent } from '@moebius/fluent'

// Create an instance of @moebius/fluent and configure it
export const fluent = new Fluent();

// Add "english" translation
fluent.addTranslation({
  // Specify one or more locales supported by your translation:
  locales: "en",

  // Or the translation files:
  filePath: [
    `${__dirname}/../i18n/commands.en.ftl`,
    `${__dirname}/../i18n/messages.en.ftl`,
    `${__dirname}/../i18n/errors.en.ftl`
  ],
  // All the aspects of Fluent are highly configurable:
  bundleOptions: {
    // Use this option to avoid invisible characters around placeables.
    useIsolating: false,
  },
});

// Add "french" translation
fluent.addTranslation({
  // Specify one or more locales supported by your translation:
  locales: "fr",

  // Or the translation files:
  filePath: [
    `${__dirname}/../i18n/commands.fr.ftl`,
    `${__dirname}/../i18n/messages.fr.ftl`,
    `${__dirname}/../i18n/errors.fr.ftl`
  ],
  // All the aspects of Fluent are highly configurable:
  bundleOptions: {
    // Use this option to avoid invisible characters around placeables.
    useIsolating: false,
  },
});
