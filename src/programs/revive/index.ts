let lastRevival: number;

const ONE_HOUR_IN_MILLISECONDS = 1000 * 60 * 60;

export const canReviveServer = () => {
  if (!lastRevival || Date.now() - lastRevival > ONE_HOUR_IN_MILLISECONDS) {
    lastRevival = Date.now();
    return true;
  }
  return false;
};

export const getWaitTime = () => {
  return Math.round((lastRevival + ONE_HOUR_IN_MILLISECONDS) / 1000);
};
