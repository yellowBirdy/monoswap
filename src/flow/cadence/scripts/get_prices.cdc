import MonoswapFTPair from 0xMONOSWAP_ADDRESS

pub fun main():  {String: UFix64} {
  return {
        MonoswapFTPair.xName :  MonoswapFTPair.getXPrice(),
        MonoswapFTPair.yName :  MonoswapFTPair.getYPrice()
  }
}
