export interface SecurityConfiguration {
  secret: string
  hashEngine: string
  pwdStoreSize: number
  tokenTimeout: number
  refreshTimeout: number
}

export default (): SecurityConfiguration => ({
  secret: process.env.APP_SECURITY_SECERT || 'secret',
  hashEngine: process.env.APP_SECURITY_HASHENGINE || 'sha224',
  pwdStoreSize: Number.parseInt(process.env.APP_SECURITY_PWDSTORESIEZE || '128', 10),
  tokenTimeout: Number.parseInt('60000', 10),
  refreshTimeout: Number.parseInt('90000', 10),
});
