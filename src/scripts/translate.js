const axios = require('axios')
const fs = require('fs')

const googleSheetTranslate =
'https://script.google.com/macros/s/AKfycbyQj_4JyhcztB-QZlCZtE6Yss7aQrtOH-5EDRxlz8lg0Ko_JcA3mCYxpFEzrXlorMUOTQ/exec'
async function pullTranslate() {
    try {
        const res = await axios.get(googleSheetTranslate)

        if (!res.data) {
            throw new Error('Không nhận được dữ liệu từ Google Sheet')
        }

        const dataRes = Array.isArray(res.data) ? res.data : [res.data]
        const localesTitle = []

        dataRes.forEach((obj) => {
            if (obj && typeof obj === 'object') {
                localesTitle.push(Object.keys(obj)[0])
            }
        })

        let dataLocales = {}

        dataRes.forEach((obj) => {
            dataLocales = Object.assign(dataLocales, obj)
        })

        localesTitle.forEach((locale) => createFile(locale, dataLocales[locale]))
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message)
        if (error.response) {
            console.error('Status:', error.response.status)
            console.error('Data:', error.response.data)
        }
    }
}

function createFile(name, content) {
    try {
        const resourcesDir = './src/locales'

        if (!fs.existsSync(resourcesDir)) fs.mkdirSync(resourcesDir)

        fs.writeFileSync(
            resourcesDir + `/${name}.json`,
            JSON.stringify(content),
        )

        console.log(`\x1b[32m${name} \x1b[0mlanguage has been updated`)
    } catch (error) {
        console.log(
            `There was an \x1b[31merror \x1b[0mwhile updating the \x1b[32m${name} \x1b[0mlanguage file: ${error?.message}`,
        )
    }
}

(() => pullTranslate())()
