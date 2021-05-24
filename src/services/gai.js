const puppeteer = require('puppeteer');
const download = require('image-downloader');
const fs = require('fs');

async function getLink(p) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(`https://thienvadia.com/diendan/forums/gai-goi-khu-vuc-noi-thanh-ha-noi.193/page-${p}`)
    let links = await page.evaluate(() => {
        let linksGot = document.querySelectorAll('h3 > a.PreviewTooltip')
        linksGot = [...linksGot]
        linksGot = linksGot.map(l =>l.getAttribute('href'))
        return linksGot
    })
    await browser.close()
    console.log(links)
    for (var j=0; j<links.length; j++){
        await getImg(links[j])
    }
};

async function getImg(link){
    const browser = await puppeteer.launch();
    console.log('Browser openned');
    const page = await browser.newPage();

    const url = `https://thienvadia.com/diendan/${link}`;
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url);
    console.log(`Page loaded: ${url}`);

    const imgLinks = await page.evaluate(() => {
        let imgElements = document.querySelectorAll('img.LbImage');
        imgElements = [...imgElements];
        let imgLinks = imgElements.map(i => i.getAttribute('src'));
        return imgLinks;
    });
    console.log(imgLinks);
    let pth = `${link}`.replace('threads', '')
    pth = 'gai/' + pth.replace(/[0-9,/,.,%]*/gi, '');
    if (!fs.existsSync(pth)) fs.mkdirSync(pth)
    await Promise.all(imgLinks.map(imgUrl => {
        if (imgUrl.slice(0,4)=='http') {
            if (imgUrl.slice(0,5)=='http:') imgUrl = imgUrl.replace('http', 'https')
            download.image({
                url: imgUrl,
                dest: pth})
        }
    }));
    await browser.close();
    console.log(`Browser closed. Downloaded ${pth}`)
    
};

(async ()=>{
    for ( let k=2; k<=7; k++){ await getLink(k)}
    console.log('Download completed!')
})();


