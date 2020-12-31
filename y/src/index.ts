import { Command, flags } from '@oclif/command'
import axios from 'axios'
const crypto = require('crypto')
const md55 = require('blueimp-md5')
import {md5} from './lib'

class Y extends Command {
  static description = 'traslate tool.'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'keyword'}]

  async run() {
    const { args } = this.parse(Y)
    const { keyword } = args
    const url = 'http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule'
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
    const timeStamp = new Date().getTime()
    const salt = timeStamp + parseInt(`${10 * Math.random()}`, 10);
    const bv = md5(ua)
    const headers = {
      'User-Agent': ua,
      'Cookie': `OUTFOX_SEARCH_USER_ID=681862452@113.118.122.229; JSESSIONID=aaah48VyKA1JkfLGbMuox; OUTFOX_SEARCH_USER_ID_NCOO=1008136583.2015002; JSESSIONID=abcG22beUmYqe491zcvox; DICT_UGC=be3af0da19b5c5e6aa4e17bd8d90b28a|; SESSION_FROM_COOKIE=www.google.com; NTES_YD_SESS=0Q0jUE6IUI1SspUT0KuHnUJUEg4_wTRHfBMIXhFlXmy4O1zGOBYERDfht3QWNVfyVySJmppg.Ms8wIm.OWa4qzNLTTjHdcemIoKHDQ28ry8TTSrbqoX4GZX3cEEerd_BodJhdZQRa45pV4l1zgFzZJPs5Is3m1kroc2UkKphf6CINnsoqEDD8rCYEU7RRWDik4jox9RCa.Gln7PwtHhrXP7VfYrn_sLWl.NYvdRUt_Owk; NTES_YD_PASSPORT=qYLmcY9XOZ0GOJpjdlrpXIpOUlaIvDBkEjOFn7P0n1zZDJLIDjktuVm7rsEad5mz5zRQ1ii9UOv90HpLQXDvUsWfjx33QJh9LJx2mYF5GZxXQPqairycwmES.w3cDcP4de3NhknF_QUoCE6kqj5I26Kd0kp6eec9IHPtxrTUYTGHi.bOYbRZyR.Id2PyCvHijMtNQbmyuq3t6IUAgc8GfW3XwXDVQ0DA6LObYUZmpL9wo; S_INFO=1609211892|0|3&80##|15676383109; P_INFO=15676383109|1609211892|1|youdao_zhiyun2018|00&99|null&null&null#gud&440300#10#0|&0|null|15676383109; ___rl__test__cookies=1609396130445`,
      'Referer': 'http://fanyi.youdao.com/'
    }
    console.log(bv, md55(ua));

  }
}

export = Y
