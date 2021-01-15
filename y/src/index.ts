import { Command, flags } from '@oclif/command'
import axios from 'axios'
const qs = require('qs')
import { md5 } from './lib'

class Y extends Command {
  static description = 'translate tool.'

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'keyword', required: true }]

  async run() {
    const { args } = this.parse(Y)
    const { keyword } = args
    const url = 'http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule'
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
    const timeStamp = new Date().getTime()
    const salt = `${timeStamp}1`
    const bv = '4f7ca50d9eda878f3f40fb696cce4d6d'
    const headers = {
      'User-Agent': ua,
      'Cookie': `OUTFOX_SEARCH_USER_ID=681862452@113.118.122.229; JSESSIONID=aaah48VyKA1JkfLGbMuox; OUTFOX_SEARCH_USER_ID_NCOO=1008136583.2015002; JSESSIONID=abcG22beUmYqe491zcvox; DICT_UGC=be3af0da19b5c5e6aa4e17bd8d90b28a|; SESSION_FROM_COOKIE=www.google.com; NTES_YD_SESS=0Q0jUE6IUI1SspUT0KuHnUJUEg4_wTRHfBMIXhFlXmy4O1zGOBYERDfht3QWNVfyVySJmppg.Ms8wIm.OWa4qzNLTTjHdcemIoKHDQ28ry8TTSrbqoX4GZX3cEEerd_BodJhdZQRa45pV4l1zgFzZJPs5Is3m1kroc2UkKphf6CINnsoqEDD8rCYEU7RRWDik4jox9RCa.Gln7PwtHhrXP7VfYrn_sLWl.NYvdRUt_Owk; NTES_YD_PASSPORT=qYLmcY9XOZ0GOJpjdlrpXIpOUlaIvDBkEjOFn7P0n1zZDJLIDjktuVm7rsEad5mz5zRQ1ii9UOv90HpLQXDvUsWfjx33QJh9LJx2mYF5GZxXQPqairycwmES.w3cDcP4de3NhknF_QUoCE6kqj5I26Kd0kp6eec9IHPtxrTUYTGHi.bOYbRZyR.Id2PyCvHijMtNQbmyuq3t6IUAgc8GfW3XwXDVQ0DA6LObYUZmpL9wo; S_INFO=1609211892|0|3&80##|15676383109; P_INFO=15676383109|1609211892|1|youdao_zhiyun2018|00&99|null&null&null#gud&440300#10#0|&0|null|15676383109; ___rl__test__cookies=1609396130445`,
      'Referer': 'http://fanyi.youdao.com/',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    const data = {
      'i': keyword,
      'from': 'AUTO',
      'to': 'AUTO',
      'smartresult': 'dict',
      'client': 'fanyideskweb',
      'salt': salt,
      'sign': md5("fanyideskweb" + keyword + salt + "Tbh5E8=q6U3EXe+&L[4c@"),
      'ts': `${timeStamp}`,
      'bv': bv,
      'doctype': 'json',
      'version': '2.1',
      'keyfrom': 'fanyi.web',
      'action': 'FY_BY_REALTlME'
    }
    axios.defaults.headers = headers
    axios.post(url, qs.stringify(data))
      .then((res) => {
        switch (res.data.errorCode) {
          case 0:
            console.log(`\n\t\t直译: ${res?.data?.translateResult[0][0]?.tgt}\n`);
            res.data.smartResult?.entries.forEach((i: string) => {
              console.log(`\t\t${i}`);
            })
            break;
          case 40:
            console.log(`翻译失败, ${keyword} 似乎不是一个有效的词语`);
            break;
          case 20:
            console.log(`翻译失败, ${keyword} 过长.`);
            break;
          case 30:
            console.log(`翻译失败, ${keyword} 无法进行有效的翻译.`);
            break;
          default:
            console.log(`响应错误码: ${res.data.errorCode}, 翻译失败.`);
            break;
        }
      })
      .catch(err => console.log('翻译失败.', err))
  }
}

export = Y
