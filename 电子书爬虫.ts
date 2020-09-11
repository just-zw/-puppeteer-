const axios=require('axios')
const fs=require('fs');
const puppeteer=require('puppeteer');
let url='http://www.785888.net/xhqh/index.html'
async function geturl(url){
  
  let bower=await puppeteer.launch({
    headless:true,
    slowMo:200
  })
  let page=await bower.newPage()
  await page.goto(url)
let item=await page.$$('.list .listBox ul li>a')
item.forEach(async v=>{

  let {_remoteObject}=await v.getProperty('href')
  let newurl=await _remoteObject.value
  let newpage= await bower.newPage()
 await newpage.goto(newurl)
 let newe=await newpage.$('.wrap .showDown ul li:last-child>a') 
 let newjson=await newe.getProperty('href');
 let newjosns=await newe.getProperty('title')
let finalurl=await newjson._remoteObject.value
let finalname=await newjosns._remoteObject.value
finalname.replace(/《(.*?)》/img,($,$1)=>{
  finalname=$1
})
/* console.log(finalurl); */
//http://xz.785888.net//d/file/rar/%E5%BC%82%E7%95%8C%E9%80%8D%E9%81%A5%E5%89%91%E7%A5%9E.rar
let ws=fs.createWriteStream(`./book/${finalname}.epub`)
axios.get(finalurl,{responseType:'stream'}).then(res=>{ 
  res.data.pipe(ws)
  ws.on('close',()=>{
    console.log('成功');
    
  })
}

)
})
}
//geturl(url)
async function getnumber(url){
  let bower=await puppeteer.launch({
    headless:true,
    slowMo:200
  })
  let page=await bower.newPage()
  await page.goto(url)
  let newarr =await page.$$eval('.listBox .tspage>a',async item=>{ 
    return item[1].href
    
  })

  newarr=newarr.split('/index_')[1];
  newarr=newarr.split('.')[0];
  let znum=parseInt(newarr)
  return znum
  
}

async function get(){
  let znumber=await getnumber(url)
  console.log(znumber);
  
for(let i=1;i<=znumber;i++){
   setTimeout(async ()=>{
   geturl(`http://www.785888.net/xhqh/index_${i}.html`)
   },i*2000)
}
}
get()

