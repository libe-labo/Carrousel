const cron = require('node-cron')
const { exec } = require('child_process')

cron.schedule('0 0 * * * *', () => {
  exec('npm run update', (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(stdout)
  })
})
