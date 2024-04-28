const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');


const token = '7058866976:AAFTTuUH5_8cLfL_yyOTWQzNo54WU8t-CCQ';
const webAppUrl = 'https://eloquent-mermaid-da00c6.netlify.app/';



const bot = new TelegramBot(token, {polling: true});

const app = express();
app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Ниже кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl + 'form'}}]
                ]
            }
        });

        await bot.sendMessage(chatId, 'Ниже кнопка', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
                ]
            }
        });
    }
        if(msg?.web_app_data?.data) {
            try{
                const data = JSON.parse(msg?.web_app_data?.data);
                await bot.sendMessage(chatId, 'Ваши данные приняты');
                await bot.sendMessage(chatId, 'Ваши данные: ' + "Страна: " + data?.country + " Улица: " + data?.street + " Масть: " + data?.subject);
            }
            catch(e) {
                console.log(e);
            }
            
        }
});

app.post( '/web-data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;

    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная закупка',
            input_message_content: {
                message_text: 'Вы купили: ' + products + " На сумму: " + totalPrice
            }
        })
        return res.status(200)
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось закупиться',
            input_message_content: {
                message_text: "Не удалось закупиться"
            }
        })
        return res.status(500).json(e)
    }

})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Сервачок запущен на ${PORT} порту`);
});

