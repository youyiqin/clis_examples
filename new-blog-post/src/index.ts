import {Command, flags} from '@oclif/command'
import axios from 'axios'
const fs = require('fs')

class NewBlogPost extends Command {
  static description = 'create a basic post template file.';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    keyword: flags.string({
      char: 'k',
      description: 'auto get a image url about the keyword.',
    }),
    debug: flags.boolean({
      char: 'd',
      description: 'debug mode, print more infos',
      default: false,
    }),
  };

  static args = [{name: 'title', required: true}];

  async run() {
    const {args, flags} = this.parse(NewBlogPost)
    const keyword = flags.keyword ?? 'code'
    const debug = flags.debug
    const basicUrl = `https://api.unsplash.com/photos/random?client_id=${process.env.UNPLASH_ID}&query=${keyword}`
    const title = args.title
    const date = new Date().toLocaleDateString()
    const fileName = title.replace(/ /g, '-')
    axios({
      method: 'GET',
      url: basicUrl,
    }).then(res => {
      if (res.status === 200) {
        const coverImg = res.data.urls.small
        const mainImg = res.data.urls.regular
        const content = `---\ntitle: '${title}'\ndate: '${date}'\ntags:\n- \nmainImg: '${mainImg}'\ncoverImg: '${coverImg}'\nintro: ''\n---\n\n`
        fs.writeFileSync(`${fileName}.md`, content, 'utf8')
      } else if (debug) {
        console.log(res.data)
      }
    })
    .catch((error: Error) => {
      if (debug) {
        console.log(`request url is: ${basicUrl}
        error message is ${error.message}`)
      } else {
        console.log('响应失败,请重试.')
      }
    })
  }
}

export = NewBlogPost;
