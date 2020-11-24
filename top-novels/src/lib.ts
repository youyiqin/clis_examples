import { rejects } from 'assert'
import axios from 'axios'
const cheerio = require('cheerio')
const chunk = require('lodash/chunk')
const fs = require('fs')
const path = require('path')
const iconv = require("iconv-lite");
export const basicUrl = 'https://www.230book.com/'

export default async function download( bookid:string ) {
  const homeUrl = `${basicUrl}book/${bookid}`
  const homepageContent = await axios.get(homeUrl, {
    responseType: "arraybuffer"
  })
  // 转码中文
  let $ = cheerio.load(iconv.decode(homepageContent.data, "gb2312"))
  const bookName = $('#info h1').text()
  const chapterUrlList: string[] = []
  $('#list ._chapter li').each((i: number, elem: HTMLElement) => {
    const chapterUrl = `${homeUrl}/${$('a', elem).attr('href')}`
    chapterUrlList.push(chapterUrl)
  })
  console.log('已获取章节，总数：', chapterUrlList.length, '，开始准备下载：');
  // 过滤掉一些莫名其妙的章节，顶点的末章是空的
  const chunkChapterUrlList = chunk(chapterUrlList.filter(item => !/undefined$/.test(item)), 10)
  let lastResultPromiseArr:any = chunkChapterUrlList.map((item: string[], index: number) => {
    return new Promise((resolve, rejects) => {
      const chapterPromiseArr = item.map(async (url) => {
        return await downloadChapterContent(url)
      })
      Promise.all(chapterPromiseArr).then(result => {
        console.log('Waiting...');
        resolve(result.reduce((prev, next) => prev + next))
      })
    })
  })

  Promise.all(lastResultPromiseArr).then((result: string[]) => {
    const content = result.reduce((prev, next) => prev + next)
    console.log(content);

  })

}


const downloadChapterContent = async (url: string, retryTimes = 3): Promise<string> => {
  return new Promise(async (resolve, rejects) => {
    axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        "user-agent": 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36'
      }
    }).then(async (resp) => {
      if (resp.status !== 200) rejects(url)
      const $ = cheerio.load(iconv.decode(resp.data, "gb2312"))
      const title = $('.bookname h1').text()
      console.log('已下载：', title);
      const text = $('#content')
        .text()
        .replace(/\s{4}/g, '\t\t\n\n\t\t')
        .replace(/作者君用心创作，无奈订阅低迷，深夜码字，须养家糊口，起点正版订阅支持！/g, '')
        .replace(/【正版订阅的同学，五分钟后刷新即可！】/g, '')
      resolve(`\t\t${title}`)
    }).catch(err => {
      if (retryTimes >= 0) {
        console.log('下载失败', err.message, url,'重试中...');
        retryTimes -= 1
        downloadChapterContent(url, retryTimes)
      } else {
        console.log(`${url}, Error: ${err.message},无法下载，跳过此章节。`);
        resolve(`\n\n\t\t${url}\t\t\n\n`)
      }
    })
  })
}
