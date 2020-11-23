import axios from 'axios'
const cheerio = require('cheerio')
const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const iconv = require("iconv-lite");
export const basicUrl = 'https://www.230book.com/'

export default async function download( bookId:string ) {
  const homeUrl = `${basicUrl}book/${bookId}`
  const homepageContent = await axios.get(homeUrl, {
    responseType: "arraybuffer"
  })
  // 转码中文
  let $ = cheerio.load(iconv.decode(homepageContent.data, "gb2312"))
  const bookName = $('#info h1').text()
  let chapterPromiseList: any = [];
  // console.log($('#list ._chapter li'));
  const itemArr = $('#list ._chapter li')
  itemArr.find('a').each(async function (i: number, e: any) {
    // console.log($(e).attr('href'));
    if (i < 1) {
      const chapterUrl = `${homeUrl}/${$(e).attr('href')}`
      chapterPromiseList.push(await downloadChapterContent(chapterUrl, i))
    }
  })

  Promise.all(chapterPromiseList).then(chapter => {
    console.log(chapter);
  })
}

const downloadChapterContent = async (url: string, chapterIndex: number) => {
  return new Promise(async (resolve, rejects) => {
    console.log('downloading。。。', url);

    axios.get(url, {
      responseType: 'arraybuffer'
    }).then(async (resp) => {
      if (resp.status !== 200) rejects(url)
      const $ = cheerio.load(iconv.decode(resp.data, "gb2312"))
      const title = $('.bookname h1').text()
      const content = $('#content').text().replace("&nbsp;&nbsp;&nbsp;&nbsp;", "\t")

      resolve(await save(`\t\t\t\t${title}\n\n${content}\n`, path.join(process.cwd(), 'download', `${chapterIndex}.txt`)))
    }).catch(err => {
      console.log('下载失败', err.message);
      rejects(url)
    })
  })
}

const save = async (content: string, savePath = path.join(process.cwd(), 'download','novel.txt')) => {
  return new Promise(async (resolve) => {
    try {
      await fsPromises.writeFile(savePath, content, 'utf8')
      resolve(true)
    } catch (error) {
      console.log(error.message);
      resolve(false)
    }
  })
}
