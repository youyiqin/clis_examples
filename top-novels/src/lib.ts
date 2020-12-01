import axios from 'axios'
const cheerio = require('cheerio')
const iconv = require("iconv-lite");
const fs = require('fs')
const path = require('path')
const cliProgress = require('cli-progress')
const myProgressBar = new cliProgress.SingleBar({
  hideCursor: true,
  format: '进度：| {bar} | {value}/{total}, 当前下载章节：{title}',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
})
export const basicUrl = 'https://www.230book.com/'


export default async function download(bookid: string) {
  const homeUrl = `${basicUrl}book/${bookid}`
  const homepageContent = await axios.get(homeUrl, {
    responseType: "arraybuffer"
  })
  // 转码中文
  let $ = cheerio.load(iconv.decode(homepageContent.data, "gb2312"))
  const bookName = $('#info h1').text()
  const chapterUrlList: { title: string, url: string }[] = []
  $('#list ._chapter li a')
    .each((i: number, elem: HTMLElement) => {
      const chapterUrl = `${homeUrl}/${$(elem).attr('href')}`
      chapterUrlList.push({
        title: $(elem).text(),
        url: chapterUrl
      })
    })
  console.log(`<<\n\t\t\t\t${bookName}>>\n`);
  console.log('章节总数：', chapterUrlList.length, '，开始准备下载：');
  let txtArr = []
  let index = 0
  while (index < chapterUrlList.length) {
    const { url, title } = chapterUrlList[index]
    const content = await downloadChapterContent(url)
    // 逐一下载
    txtArr.push(content)
    myProgressBar.start(chapterUrlList.length, index, { title: '' })
    index += 1
    myProgressBar.update(index, { title })
  }
  myProgressBar.update(index)
  myProgressBar.stop()
  // 修复
  txtArr.map(async (item) => {
    const savePath = path.join(process.cwd(), `${bookName}.txt`)
    if (item.startsWith('https')) {
      const result = await downloadChapterContent(item.trim(), 0)
      fs.appendFileSync(savePath, result, 'utf8')
    } else {
      fs.appendFileSync(savePath, item, 'utf8')
    }
  })
}

// 返回字符串
const downloadChapterContent = async (url: string, retryTimes = 3): Promise<string> => {
  return new Promise(async (resolve, rejects) => {
    axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        "user-agent": 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36'
      }
    }).then(async (resp) => {
      // 异常响应，写入地址，后期修复替换。
      if (resp.status !== 200) resolve(`\t\t${url}\n\n`)
      // 正常下载
      const $ = cheerio.load(iconv.decode(resp.data, "gb2312"))
      const title = $('.bookname h1').text()
      const text = $('#content')
        .text()
        .replace(/\s{4}/g, '\t\t\n\n\t\t')
        .replace(/作者君用心创作，无奈订阅低迷，深夜码字，须养家糊口，起点正版订阅支持！/g, '')
        .replace(/【正版订阅的同学，五分钟后刷新即可！】/g, '')
      resolve(`\t\t${title}\n\n${text}\n\n\n\n`)
    }).catch(err => {
      // 三次重试
      if (retryTimes > 0) {
        console.log('下载失败', err.message, url, '重试中...');
        retryTimes -= 1
        downloadChapterContent(url, retryTimes)
      } else {
        // 先行跳过
        console.log(`${url}, Error: ${err.message},暂时跳过此章节，后续修复补全丢失内容,修复失败则直接写入地址。`);
        resolve(`\t\t${url}\n\n`)
      }
    })
  })
}
