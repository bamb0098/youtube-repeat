function ready(fn) {
    if (document.readyState != 'loading'){
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

let slider = `
<div class="middle"> <div class="multi-range-slider"> <!-- 진짜 슬라이더 --> <input type="range" id="input-left" min="0" max="100" value="25" /> <input type="range" id="input-right" min="0" max="100" value="75" /> <!-- 커스텀 슬라이더 --> <div class="slider"> <div class="track"></div> <div class="range"></div> <div class="thumb left"></div> <div class="thumb right"></div> </div> </div> </div>
`;

ready(()=>{

    let progressElement = document.querySelector('.ytp-progress-bar-container');
    let sliderElement = htmlToElement(slider);

    console.log(progressElement)
    
    document.body.append(sliderElement)
    
    sliderElement.style.left = progressElement.getBoundingClientRect().x+"px";
    sliderElement.style.top = (progressElement.getBoundingClientRect().y-progressElement.getBoundingClientRect().height)+"px";
    sliderElement.style.width = progressElement.getBoundingClientRect().width+"px";
    sliderElement.style.height = progressElement.getBoundingClientRect().height+"px";
    
    
    const inputLeft = document.getElementById("input-left");
    const inputRight = document.getElementById("input-right");
    const thumbLeft = document.querySelector(".slider > .thumb.left");
    const thumbRight = document.querySelector(".slider > .thumb.right");
    const range = document.querySelector(".slider > .range");
    const setLeftValue = () => { const _this = inputLeft;
        const [min, max] = [parseInt(_this.min), parseInt(_this.max)];
        // 교차되지 않게, 1을 빼준 건 완전히 겹치기보다는 어느 정도 간격을 남겨두기 위해. 
        _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);
        // input, thumb 같이 움직이도록 
        const percent = ((_this.value - min) / (max - min)) * 100; thumbLeft.style.left = percent + "%";
        range.style.left = percent + "%";
    };
    const setRightValue = () => { const _this = inputRight;
        const [min, max] = [parseInt(_this.min), parseInt(_this.max)];
        // 교차되지 않게, 1을 더해준 건 완전히 겹치기보다는 어느 정도 간격을 남겨두기 위해. 
        _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);
        // input, thumb 같이 움직이도록 
        const percent = ((_this.value - min) / (max - min)) * 100;
        thumbRight.style.right = 100 - percent + "%";
        range.style.right = 100 - percent + "%";
    };
    inputLeft.addEventListener("input", setLeftValue);
    inputRight.addEventListener("input", setRightValue);

    window.addEventListener('resize', function (e) {
        setTimeout(()=>{
            let progressElement = document.querySelector('.ytp-progress-slider-container');
            sliderElement.style.width = progressElement.getBoundingClientRect().width+"px";
            sliderElement.style.height = progressElement.getBoundingClientRect().height+"px";
            sliderElement.style.left = progressElement.getBoundingClientRect().x+"px";
            sliderElement.style.top = progressElement.getBoundingClientRect().y+"px";
        },500)
    }, false);
})
