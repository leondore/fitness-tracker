/* eslint-disable no-console */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error({
      error,
      component: instance?.$options.__name,
      info,
    });

    return false;
  };
});
