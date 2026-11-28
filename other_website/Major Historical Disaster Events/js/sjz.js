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

const thingtimePanel = document.getElementById("thingtime");
const thingtimeList = document.querySelector("#thingtime ul");
const knobView = document.getElementById("knob-view");
const knobDate = document.getElementById("knob-date");
const knobType = document.getElementById("knob-type");
const knobPeekPrev = document.getElementById("knob-peek-prev");
const knobPeekNext = document.getElementById("knob-peek-next");
let currentIndex = 0;
let jumpUntil = 0;

function labelOf(item, index) {
    return (
        item.dataset.site ||
        item.querySelector(".content-title")?.textContent.trim() ||
        `第 ${index + 1} 个事件`
    );
}
function splitLabel(text) {
    const parts = text.trim().split(/\s+/);
    const date = parts.shift() || text;
    return { date: date, type: parts.join(" ") };
}

function shortLabel(index) {
    const normalized = (index + items.length) % items.length;
    const parts = splitLabel(labelOf(items[normalized], normalized));
    return `${parts.date} ${parts.type}`;
}
const thingtimeItems = items.map((item, index) => {
    const li = document.createElement("li");
    li.textContent = labelOf(item, index);
    thingtimeList.appendChild(li);
    return li;
});

function updateKnob(index) {
    const parts = splitLabel(labelOf(items[index], index));
    knobDate.textContent = parts.date;
    knobType.textContent = parts.type;
    knobPeekPrev.textContent = shortLabel(index - 1);
    knobPeekNext.textContent = shortLabel(index + 1);
}

function goToIndex(index) {
    const normalized = (index + items.length) % items.length;
    const targetTop =
        items[normalized].getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight * 0.18;
    currentIndex = normalized;
    jumpUntil = Date.now() + 500;
    window.scrollTo({ top: targetTop, behavior: "smooth" });
    updateKnob(normalized);
}

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

    // 让左侧事件列表与旋钮都和当前 item 保持同步
    const activeIndex = items.indexOf(activeItem);
    if (Date.now() >= jumpUntil) {
        currentIndex = activeIndex;
        updateKnob(activeIndex);
    }
    thingtimeItems.forEach((li, index) => {
        li.classList.toggle("thingtime-item-active", index === activeIndex);
    });
}
activateItem(items[0]);
setBackground(items[0]);

thingtimeList.addEventListener("click", function (e) {
    const targetLi = e.target.closest("li");//获取点击对象
    const index = thingtimeItems.indexOf(targetLi);//获取点击对象的序号
    if (index >= 0) {
        goToIndex(index);
    }
});
// const arrow = document.querySelector("#arrow");
const thingtimeContent = document.querySelector("#thingtime-content");
// arrow.addEventListener("click", function () {
//     thingtimeContent.classList.toggle("thingtime-content-hidden");
//     if (thingtimeContent.classList.contains("thingtime-content-hidden")) {
//         arrow.innerHTML = "◀"
//     }
//     else {
//         arrow.innerHTML = "▶"
//     }

// });
const button = document.querySelector("#button");
let i = 0;

function applyMode(mode) {
    if (mode === 0) {
        button.textContent = "列表";
        thingtimeContent.classList.remove("thingtime-content-hidden");
        thingtimeList.style.display = "";
        knobView.classList.remove("knob-view-active");
        thingtimePanel.classList.remove("thingtime-compact");
    } else if (mode === 1) {
        button.textContent = "隐藏";
        thingtimeContent.classList.add("thingtime-content-hidden");
        thingtimeList.style.display = "";
        knobView.classList.remove("knob-view-active");
        thingtimePanel.classList.remove("thingtime-compact");
    } else if (mode === 2) {
        button.textContent = "旋钮";
        thingtimeContent.classList.remove("thingtime-content-hidden");
        thingtimeList.style.display = "none";
        knobView.classList.add("knob-view-active");
        thingtimePanel.classList.add("thingtime-compact");
        updateKnob(currentIndex);
    }
}

button.addEventListener("click", function () {
    i++;
    applyMode(i % 3);
});

let lastWheel = -Infinity;

thingtimePanel.addEventListener("wheel", function (event) {
    if (i % 3 !== 2) return;
    event.preventDefault();
    const now = Date.now();
    if (now - lastWheel < 90) return;
    lastWheel = now;
    goToIndex(currentIndex + (event.deltaY > 0 ? 1 : -1));
}, { passive: false });

applyMode(i % 3);

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