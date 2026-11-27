let offsetY;
let judge_video = 0;
let lastY = 0;
let guide = document.querySelector('#guide');
let title = document.querySelector('#title');
let video = document.querySelector('.guide-video');
// 改变顶部栏的颜色
const canvas = document.createElement('canvas');
// true那一行是方便快速渲染，更改了识别的方式
const ctx = canvas.getContext('2d', { willReadFrequently: true });
canvas.width = 50;
canvas.height = 50;

function checkBrightness() {

    // 先清理画布
    ctx.clearRect(0, 0, canvas.width, canvas.height * 0.2);
    // 创建画布，读取这时的颜色
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height * 0.2);
    // 读取画布上现在的颜色
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height * 0.2).data;
    let totalBrightness = 0;
    let pixelCount = imageData.length / 4;

    for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];

        // 计算亮度的公式，累加后算平均值
        totalBrightness += (r * 0.299 + g * 0.587 + b * 0.114);
    }
    const avgBrightness = totalBrightness / pixelCount;
    const avg = avgBrightness / 255;

    title.style.setProperty('--transparent', 0.2 * avg);
    requestAnimationFrame(checkBrightness);

}
requestAnimationFrame(checkBrightness);




// 判断新闻界面的位置让顶部导航栏变色
let news = document.querySelector('#new');
let slide_introduction = document.querySelector('#slide_introduction');
// 演示显现箭头
let timer_logo = null;
video.addEventListener('mousemove', () => {
    slide_introduction.style.opacity = 1;
    clearTimeout(timer); // 每次移动，清空旧计时器，重新计时
    timer_logo = setTimeout(() => {
        slide_introduction.style.opacity = 0;
    }, 2000)
})



window.addEventListener('scroll', () => {
    const rect = news.getBoundingClientRect();

    offsetY = window.scrollY;
    let isDown = offsetY > lastY;
    let isUp = offsetY < lastY;
    lastY = offsetY;

    if (offsetY <= 80 && isUp) {
        guide.style.height = "56.25vw";
        judge_video = 1;
        slide_introduction.style.opacity = 1;
    }
    if (judge_video === 1 && isDown) {
        judge_video = 0;
        guide.style.height = "25vw";
        slide_introduction.style.opacity = 0;

    }

    if (isDown) {
        title.style.visibility = 'hidden';
    } else {
        title.style.visibility = 'visible';
    }

    if (rect.top - 50 <= 0) {
        title.classList.add('is_brightness');
    }
    else {
        title.classList.remove('is_brightness')
    }
});

// 新闻

// 右边新闻的滚条
const scroll = document.querySelector('#upright_scroll')
//静止最外层盒子
const upleft = document.querySelector('#upleft_wrap');
// 照片盒子
const newImg = document.querySelector('#new_img');
// 照片点  自动生成
const dotGroup = document.querySelector('.dot-group');
// 每张照片外盒子
const items = document.querySelectorAll('.wrap-item');
// 中间白色大字体
const text_title_DOM = document.querySelector('#upleft_text_title');
//详细小白字
const text_detail_DOM = document.querySelector('#upleft_text_detail');
// 下方文本
const textDom = document.querySelector('#new_text');
// 获取图片数量
const total = items.length;
// 初始化第一张照片
let currentIndex = 0;
// 储存文字数组
const new_text = [
    "来源：新华网   10-23  00:36",
    "来源：新华网   08-28  01:15",
    "来源：新华网   07-17  13:59",
    "来源：新华网   07-26  04:40",
    "来源：新华网   07-07  11:17"
];

const title_DOM = [
    "西藏巴青发生7.0级地震<br>救援人员全力开展人员搜救",
    "西藏吉隆口岸突发泥石流灾害<br>多方救援力量挺进灾区搜救失联人员",
    "重庆彭水发生大型山体崩塌<br>救援力量携带设备进场搜救失联人员",
    "台风“红霞”以强台风级登陆广东<br>各地落实防风避险 转移群众",
    "湖北黄冈遭遇EF2级龙卷风袭击<br>房屋损毁设施受损 救援人员连夜抢险"
]

const detail_DOM = [
    "震区余震多发、高寒缺氧，当地启动抗震救灾应急响应，严防次生灾害，抢险救援工作正在紧张进行",
    "口岸区域道路损毁严重，灾害应急响应启动，工作人员转移安置受威胁群众，科学施救防范二次灾害",
    "岩体垮塌掩埋房屋道路，边坡风险高，当地启动应急响应，疏散周边群众，同步开展隐患排查整治",
    "狂风暴雨来袭，沿海多地停工停课，江河水位上涨，抢险队伍在岗值守，防范暴雨引发次生灾害",
    "强对流天气破坏力巨大，当地紧急转移受灾群众，开展伤员救治、道路清障、水电抢修工作"
]
// 跳转函数
function goTo(index) {
    currentIndex = index;
    newImg.style.transform = `translateX(-${750 * index}px)`
    textDom.innerText = new_text[index];
    text_title_DOM.innerHTML = title_DOM[index];
    text_detail_DOM.innerHTML = detail_DOM[index];
    const dots = document.querySelectorAll('.dot');
    dots.forEach((d) => {
        d.classList.remove('active');
        dots[index].classList.add('active');
    });

}
for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dot.onclick = () => goTo(i);
    dotGroup.appendChild(dot);
}
goTo(0);

let timer = setInterval(() => {
    currentIndex = (currentIndex + 1) % total;
    goTo(currentIndex);
}, 3000)
upleft.addEventListener('mouseover', () => {
    clearInterval(timer);

})
upleft.addEventListener('mouseout', () => {
    timer = setInterval(() => {
        currentIndex = (currentIndex + 1) % total;
        goTo(currentIndex);
    }, 3000)

})


// 新闻右侧滚条

let scroll_timer = null;
scroll.addEventListener('mouseover', () => {
    clearTimeout(scroll_timer);
    scroll.style.overflowY = "auto";
})
scroll.addEventListener('mouseout', () => {
    clearTimeout(scroll_timer);
    scroll_timer = setTimeout(() => {
        scroll.style.overflowY = "hidden";
    }, 800)
})


// 新闻右侧滚条





// 跳转：直接计算出要跳转的距离
const jump_distance = window.innerWidth * (0.5625 - 0.35);
function jump(id) {
    const gogogo = document.querySelector(id);
    if (!gogogo) return;
    const jump_distance = window.innerWidth * (0.5625 - 0.25);

    if (judge_video === 1) {
        judge_video = 0;
        guide.style.height = "25vw";
        // 收缩分支：当前是展开状态，减掉视频缩长度补偿
        const rect = gogogo.getBoundingClientRect();
        const targetY = rect.top + window.scrollY - jump_distance - 100;
        window.scrollTo({
            top: targetY,
            behavior: "smooth"
        })
    } else {
        // 不收缩，直接按当前位置，只减100偏移  100偏移是防止上方flex的标题把正文标题挡住了
        const rect = gogogo.getBoundingClientRect();
        const targetY = rect.top + window.scrollY - 100;
        window.scrollTo({
            top: targetY,
            behavior: "smooth"
        })
    }

}
// 去历史重大灾害事件
function goTo_other1() {
    location.href = "../../other_website/Major Historical Disaster Events/html/sjz.html";
}


// 去历史重大灾害事件

//常见灾害的应急措施
function goTo_other2() {
    location.href = "../../other_website/Response Measures/html/measures.html";
}


//常见灾害的应急措施
let now = new Date();
let year = now.getFullYear();
let month = now.getMonth() + 1;
let day = now.getDate();
let lis;
let list = document.querySelectorAll('.news-time');
list.forEach(item => {
    day--;
    lis = year + '-' + month + '-' + day;
    item.innerText = lis;
})
