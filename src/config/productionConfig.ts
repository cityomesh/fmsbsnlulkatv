// config/productionCongig.ts
export const PRODUCTION_CONFIG = {
  token: process.env.NEXT_PUBLIC_PROD_TOKEN || "",
  defaultGender: 0,
  customerType: 1,
  sublocationId: 2318,
  cdnId: 106,
  schemeId: 1,
  bouquetIds: [1010],
  rperiodId: 3,
  apiBasePath: "https://partners.ulka.tv/api/railtel.php",
  bsnlSecretKey: process.env.BSNL_EKEY as string,
};
