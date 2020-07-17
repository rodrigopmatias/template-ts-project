
export interface HttpdConfiguration {
  port: number,
  addr: string
}

export default (): HttpdConfiguration => ({
  port: Number.parseInt(process.env.APP_PORT || '5000', 10),
  addr: process.env.APP_ADDR || '127.0.0.1'
})