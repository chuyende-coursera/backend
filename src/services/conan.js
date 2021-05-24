const puppeteer = require('puppeteer');
const fs = require('fs');
const download = require('image-downloader');

async function getConan(p){
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setDefaultNavigationTimeout(0)
    await page.goto(`https://sachvui.com/doc-sach/tham-tu-lung-danh-conan-ban-dep-gosho-aoyama/chap-${p}.html`)
    const linkImg = await page.evaluate(() => {
        let listImg = document.querySelectorAll('img.truyen-tranh')
        listImg = [...listImg]
        listImg = listImg.map(img => img.getAttribute('src'))
        return listImg
    })
    console.log(linkImg)
    let path = 'conan/chap-' + p
    if (!fs.existsSync(path)) fs.mkdirSync(path)
    await Promise.all(linkImg.map(link =>{
            download.image({
            url: link,
            dest: path
            })
        })) 
    await browser.close()
}
(async()=>{
    for (let j=33; j<=1054; j++) await getConan(j)
})();
