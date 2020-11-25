import {Command, flags} from '@oclif/command'
import { result } from 'lodash';
import download from './lib'
const axios = require('axios')
const cheerio = require('cheerio')
const iconv = require("iconv-lite");
const { encodeGBK } = require('gbk-string');
const inquirer = require('inquirer')

class TopNovels extends Command {
  static description = "顶点小说下载工具"

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({ char: 'h' }),
    id: flags.string({char: 'i', description: '书籍id，从书记主页地址中获取。'})
  }

  static args = [{name: 'name', default: '太虚'}]

  async run() {
    const {args, flags} = this.parse(TopNovels)
    const { name } = args
    const bookId = flags.id
    if (bookId) {
      await download(bookId)
    } else {
      console.log('search: ', name);
      axios.post(`https://www.230book.com/modules/article/search.php?searchkey=${encodeGBK(name)}&searchtype=articlename`, {}, {
        responseType: "arraybuffer"
      }).then((resp: any) => {
        // 转码中文
        let $ = cheerio.load(iconv.decode(resp.data, "gb2312"))
        let resultArr: {name: string, url: string}[] = []
        $('#nr').each((i: number, elem: HTMLElement) => {
          const name = $('td a', elem).first().text()
          const url = $('td a', elem).first().attr('href')
          resultArr.push({
            name, url
          })
        })
        if (resultArr.length === 0) {
          console.log('无搜索结果，再次搜索则需要等待30秒。');
        }
        inquirer.prompt([
          {
            type: 'list',
            name: 'url',
            message: '搜索结果选择',
            choices: resultArr.map((item: { name: string, url: string }) => {
              return {
                name: item.name,
                value: item.url
              }
            })
          }
        ]).then(async (answer: any) => {
          // 选择了下载目标，执行下载
          await download(answer.url.replace('https://www.230book.com/book/', '').replace('/', ''))
        })
      })
    }
  }
}

export = TopNovels
