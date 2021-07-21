const puppeteer = require('puppeteer')
const nodemailer = require("nodemailer");
const https = require('https');
const web = 'T028PDGM7L3/B028CG7FQMV/ao3qnTSmGJwxZPSrQMSNjBdm';
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: 'process.env.EMAIL_KEY', 
      pass: 'process.env.PASS_KEY',
    },
  });

  let info = transporter.sendMail({
    from: '"teste" <blgianini@gmail.com>', 
    to: "blgianini@gmail.com, blgianini@gmail.com", 
    subject: "Iniciou", 
    text: "Rodando!", 
  }); 
sendMessage("Rodando!");

async function scrapeStatus(url){
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto (url);

    const [status1] = await page.$x('/html/body/div[1]/div[2]/div[2]/div[1]/div[1]/div/span[2]');
    const txt = await status1.getProperty('textContent');
    const st1 = await txt.jsonValue();

    const [status2] = await page.$x('/html/body/div[1]/div[2]/div[2]/div[1]/div[1]/div/span[2]');
    const txt2 = await status2.getProperty('textContent');
    const st2 = await txt2.jsonValue();

    const [status3] = await page.$x('/html/body/div[1]/div[2]/div[2]/div[1]/div[1]/div/span[2]');
    const txt3 = await status3.getProperty('textContent');
    const st3 = await txt3.jsonValue();

    const [status4] = await page.$x('/html/body/div[1]/div[2]/div[2]/div[1]/div[1]/div/span[2]');
    const txt4 = await status4.getProperty('textContent');
    const st4 = await txt4.jsonValue();

    setInterval(function(){ 
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();

        console.log({st1, st2, st3, st4});
        console.log(year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);

        if(st1 != '\n    Operational\n  '){
            sendMessage(st1, st2, st3, st4);
            let info = transporter.sendMail({
                from: '"teste" <blgianini@gmail.com>', 
                to: "blgianini@gmail.com, blgianini@gmail.com", 
                subject: "Serviço fora do AR", 
                text: "Serviço de Checkout da VTex fora do ar!", 
              }); 
        }
        if(st2 != '\n    Operational\n  '){
          sendMessage(st1, st2, st3, st4);
            let info = transporter.sendMail({
                from: '"teste" <blgianini@gmail.com>', 
                to: "blgianini@gmail.com, blgianini@gmail.com", 
                subject: "Serviço fora do AR", 
                text: "Serviço de WebStore da VTex fora do ar!", 
              });
        }
        if(st3 != '\n    Operational\n  '){
          sendMessage(st1, st2, st3, st4);
            let info = transporter.sendMail({
                from: '"teste" <blgianini@gmail.com>', 
                to: "blgianini@gmail.com, blgianini@gmail.com", 
                subject: "Serviço fora do AR", 
                text: "Serviço de Administrative Environment da VTex fora do ar!", 
              });
        }
        if(st4 != '\n    Operational\n  '){
          sendMessage(st1, st2, st3, st4);
            let info = transporter.sendMail({
                from: '"teste" <blgianini@gmail.com>', 
                to: "blgianini@gmail.com, blgianini@gmail.com", 
                subject: "Serviço fora do AR", 
                text: "Serviço de Internal Modules da VTex fora do ar!", 
              });
        }
        console.log({st1, st2, st3, st4});
    }, 5000);
    browser.close();
}

scrapeStatus('https://status.vtex.com/#')

function sendMessage(st1, st2, st3, st4){
    const yourWebHookURL = 'https://hooks.slack.com/services/' + web;
    const userAccountNotification = {
        "username": "Erro de disponibilidade VTex",
        "text": "Algum serviço VTex está indisponível.", 
        "icon_emoji": ":bangbang:",
        "attachments": [{ 
          "color": "#eed140",
          "fields": [ 
            {
              "title": "Serviço", 
              "value": "Checkout",
              "short": true 
            },
            {
              "title": "Status",
              "value": st1,
              "short": true
            },
            {
                "title": "Serviço", 
                "value": "WebStore", 
                "short": true 
              },
              {
                "title": "Status",
                "value": st2,
                "short": true
              },
              {
                "title": "Serviço",
                "value": "Administrative Environment", 
                "short": true
              },
              {
                "title": "Status",
                "value": st3,
                "short": true
              },
              {
                "title": "Serviço", 
                "value": "Internal Modules", 
                "short": true 
              },
              {
                "title": "Status",
                "value": st4,
                "short": true
              },

          ]
        }]
      };
    /**
     * Handles the actual sending request. 
     * We're turning the https.request into a promise here for convenience
     * @param webhookURL
     * @param messageBody
     * @return {Promise}
     */
    function sendSlackMessage (webhookURL, messageBody) {
      try {
        messageBody = JSON.stringify(messageBody);
      } catch (e) {
        throw new Error('Failed to stringify messageBody', e);
      }

      return new Promise((resolve, reject) => {

        const requestOptions = {
          method: 'POST',
          header: {
            'Content-Type': 'application/json'
          }
        };

        const req = https.request(webhookURL, requestOptions, (res) => {
          let response = '';
    
    
          res.on('data', (d) => {
            response += d;
          });

          res.on('end', () => {
            resolve(response);
          })
        });

        req.on('error', (e) => {
          reject(e);
        });

        req.write(messageBody);
        req.end();
      });
    }

    (async function () {
      if (!yourWebHookURL) {
        console.error('Please fill in your Webhook URL');
      }
    
      console.log('Sending slack message');
      try {
        const slackResponse = await sendSlackMessage(yourWebHookURL, userAccountNotification);
        console.log('Message response', slackResponse);
      } catch (e) {
        console.error('There was a error with the request', e);
      }
    })();
}
