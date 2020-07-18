export interface SecurityConfiguration {
  secret: string,
  hashEngine: string,
  pwdStoreSize: number
}

export default (): SecurityConfiguration => ({
  secret: process.env.APP_SECURITY_SECERT || 'secret',
  hashEngine: process.env.APP_SECURITY_HASHENGINE || 'sha224',
  pwdStoreSize: Number.parseInt(process.env.APP_SECURITY_PWDSTORESIEZE || '128', 10),
});
