import {Command, flags} from '@oclif/command'
import download from './lib'

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
    }
  }
}

export = TopNovels
