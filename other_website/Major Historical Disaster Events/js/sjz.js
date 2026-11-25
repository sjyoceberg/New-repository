const returnTop = document.getElementById("return-top")
function updatereturnTop() {
    returnTop.classList.toggle("return-top-active", window.scrollY > 320);
}
window.addEventListener("scroll", updatereturnTop)
returnTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
})

const shell = document.getElementById("shell");
//报错准备
if (!shell) {
    throw new Error("找不到 id 为 shell 的时间轴容器。");
}
//储存
const items = Array.from(shell.querySelectorAll(".item"));
if (items.length === 0) {
    throw new Error("时间轴容器中没有 .item 条目。");
}
const activeClass = "item--active";

function setBackground(item) {
    const image = item.querySelector(".img");
    if (!image) {
        throw new Error("时间轴条目中缺少 .img 图片元素。");
    }
    const imageSource = image.getAttribute("src");
    if (!imageSource) {
        throw new Error("时间轴图片缺少 src 路径。");
    }
    shell.style.backgroundImage = `url("${imageSource}")`;
}
function activateItem(activeItem) {
    items.forEach((item) => {
        item.classList.remove(activeClass);
    });
    activeItem.classList.add(activeClass);

    // 让右侧时间轴中的 li 与当前 item 保持同步
    const activeIndex = items.indexOf(activeItem);
    thingtimeItems.forEach((li, index) => {
        li.classList.toggle("thingtime-item-active", index === activeIndex);
    });
}
const thingtime = document.querySelector("#thingtime ul");
const thingtimeItems = Array.from(
    thingtime.querySelectorAll(":scope > li")
);

thingtime.addEventListener("click", function (e) {
    const targetLi = e.target.closest("li");//获取点击对象
    const index = thingtimeItems.indexOf(targetLi);//获取点击对象的序号
    const targetItem = items[index];
    const targetTop =
        targetItem.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.18;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
});
const arrow = document.querySelector("#arrow");
const thingtimeContent = document.querySelector("#thingtime-content");
arrow.addEventListener("click", function () {
    thingtimeContent.classList.toggle("thingtime-content-hidden");
    if (thingtimeContent.classList.contains("thingtime-content-hidden")) {
        arrow.innerHTML = "◀"
    }
    else {
        arrow.innerHTML = "▶"
    }

});

// 更换背景图
function updateTimeline() {
    // 滚动距离。
    const scrollPosition = window.scrollY;
    items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();

        // 页面坐标
        const min = itemRect.top + scrollPosition - window.innerHeight * 0.2;

        //获取信息
        const itemStyle = window.getComputedStyle(item);
        const contentHeight =
            itemRect.height -
            parseFloat(itemStyle.paddingTop) -
            parseFloat(itemStyle.paddingBottom);
        const max = min + contentHeight;
        // 倒数二
        if (
            index === items.length - 2 &&
            scrollPosition > min + contentHeight / 2
        ) {
            // 最后一张图
            activateItem(items[items.length - 1]);
            setBackground(items[items.length - 1]);
        }
        //换图片
        else if (scrollPosition <= max && scrollPosition >= min) {
            activateItem(item);
            setBackground(item);

        }
    });
}
//获取时间轴信息


// 更新时间
window.addEventListener("scroll", updateTimeline);

// 页面首次加载时执行一次初始化：
// 否则首张内容、背景和右侧时间轴选中状态不会在滚动前设置。
activateItem(items[0]);
setBackground(items[0]);
updatereturnTop();