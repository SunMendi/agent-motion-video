const BN = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/** Convert ASCII digits to Bangla digits. */
export const toBangla = (value: string | number): string =>
  String(value).replace(/[0-9]/g, (d) => BN[Number(d)]);
