function getDom(selector) {
    return document.querySelector(selector)
}

function dataURL2blob (dataURL) {
    const string = dataURL.split(",")[1];

    const bin = atob(string);

    const uint8Array = new Uint8Array(bin.length);

    for(let i = 0; i < bin.length; i++) {
        uint8Array[i] = bin.charCodeAt(i);
    }

    return new Blob([uint8Array], {type: "image/png"});
}

function decode(str) {
    const str1 = decodeURIComponent(str);
    const arr = str1.split(',');
    const arr1 = arr.map(item => String.fromCharCode(parseInt(item, 16) - 3));
    return arr1.join('');
}

function urlSearchParams() {
    const search = window.location.search.substring(1);
    const obj = {};
    if(search) {
        const arr = search.split("&");
        let length = arr.length;

        while(length) {
            const attr = arr[--length].split("=");
            obj[decodeURIComponent(attr[0])] = !!attr[1] ? decodeURIComponent(attr[1]) : undefined;
        }
    }

    return obj;
}

const searchParams = urlSearchParams();

let s = searchParams.s || '';

const URL = window.URL || window.webkitURL;

const devicePixelRatio = window.devicePixelRatio || 1;

function init() {
    const pageRead = getDom('#pageRead');
    const pageMain = getDom('#pageMain');
    const pageNo = getDom('#pageNo');
    const pagePhone = getDom('#pagePhone');
    const pageCard = getDom('#pageCard');
    const pageSign = getDom('#pageSign');
    const btnRead = getDom('#btnRead');
    const btnBackRead = getDom('#btnBackRead');
    const btnScrollPhone = getDom('#btnScrollPhone');
    const btnScrollCard = getDom('#btnScrollCard');
    const btnScrollSign = getDom('#btnScrollSign');

    const noDownload = getDom('#noDownload');
    const btnBackSign = getDom('#btnBackSign');
    const btnDownload = getDom('#btnDownload');
    const downloadImg = getDom('#downloadImg');
    const downloadLink = getDom('#downloadLink');

    let topSignImageData = null;
    const topSignPosition = [308, 215, 66, 30];

    let noImageData = null;
    const noPosition = [562, 216, 250, 30];

    let phoneImageData = null;
    const phonePosition = [222, 250, 190, 30];

    let cardImageData = null;
    const cardPosition = [548, 250, 250, 30];

    let signImageData = null;
    const signPosition = [622, 2520, 200, 90];

    const agreementCanvas = getDom('#agreementCanvas');
    const agrContext = agreementCanvas.getContext('2d');

    const signCanvas = getDom('#signCanvas');
    const signContext = signCanvas.getContext('2d');
    const btnSignClear = getDom('#btnSignClear');
    const btnSignSubmit = getDom('#btnSignSubmit');

    const noCanvas = getDom('#noCanvas');
    const noContext = noCanvas.getContext('2d');

    const phoneCanvas = getDom('#phoneCanvas');
    const phoneContext = phoneCanvas.getContext('2d');
    const phoneInput = getDom('#phoneInput');
    const btnPhoneSubmit = getDom('#btnPhoneSubmit');

    const cardCanvas = getDom('#cardCanvas');
    const cardContext = cardCanvas.getContext('2d');
    const cardInput = getDom('#cardInput');
    const btnCardSubmit = getDom('#btnCardSubmit');

    noCanvas.width = noPosition[2] * devicePixelRatio;
    noCanvas.height = noPosition[3] * devicePixelRatio;

    phoneCanvas.width = phonePosition[2] * devicePixelRatio;
    phoneCanvas.height = phonePosition[3] * devicePixelRatio;

    cardCanvas.width = cardPosition[2] * devicePixelRatio;
    cardCanvas.height = cardPosition[3] * devicePixelRatio;

    signCanvas.width = signPosition[2] * devicePixelRatio;
    signCanvas.height = signPosition[3] * devicePixelRatio;

    btnRead.addEventListener('click', () => {
        pageRead.classList.add('hide');
        pageMain.classList.remove('hide');
        window.scrollTo(0, 0);
    });

    btnBackRead.addEventListener('click', () => {
        pageRead.classList.remove('hide');
        pageMain.classList.add('hide');
        window.scrollTo(0, 0);
    });

    btnBackSign.addEventListener('click', () => {
        noDownload.classList.add('hide');
        pageMain.classList.remove('hide');
        window.scrollTo(0, 0);
    });

    btnScrollPhone.addEventListener('click', () => {
        pagePhone.scrollIntoView();
    });
    btnScrollCard.addEventListener('click', () => {
        pageCard.scrollIntoView();
    });
    btnScrollSign.addEventListener('click', () => {
        pageSign.scrollIntoView();
    });

    window.scrollTo(0, 0);

    btnPhoneSubmit.addEventListener('click', () => {
        const value = phoneInput.value;

        phoneContext.clearRect(0, 0, phoneCanvas.width * devicePixelRatio, phoneCanvas.height * devicePixelRatio);
        phoneContext.font = 24 * devicePixelRatio + 'px sans-self';
        phoneContext.fillStyle = '#000000';
        phoneContext.fillText(value, 0, 23 * devicePixelRatio, phonePosition[2] * devicePixelRatio);

        agrContext.putImageData(phoneImageData, phonePosition[0], phonePosition[1]);
        agrContext.drawImage(phoneCanvas, ...phonePosition);

        window.scrollTo(0, 0);
    });

    btnCardSubmit.addEventListener('click', () => {
        const value = cardInput.value;

        cardContext.clearRect(0, 0, cardCanvas.width * devicePixelRatio, cardCanvas.height * devicePixelRatio);
        cardContext.font = 24 * devicePixelRatio + 'px sans-self';
        cardContext.fillStyle = '#000000';
        cardContext.fillText(value, 0, 23 * devicePixelRatio, cardPosition[2] * devicePixelRatio);

        agrContext.putImageData(cardImageData, cardPosition[0], cardPosition[1]);
        agrContext.drawImage(cardCanvas, ...cardPosition);

        window.scrollTo(0, 0);
    });

    btnSignClear.addEventListener('click', () => {
        signContext.clearRect(0, 0, signCanvas.width, signCanvas.height);
    });
    btnSignSubmit.addEventListener('click', () => {
        agrContext.putImageData(topSignImageData, topSignPosition[0], topSignPosition[1]);
        agrContext.putImageData(signImageData, signPosition[0], signPosition[1]);
        agrContext.drawImage(signCanvas, ...signPosition);
        agrContext.drawImage(signCanvas, ...topSignPosition);

        agreementCanvas.scrollIntoView(false);
    });


    // 加载图片
    function loadedImage(src) {
        return new Promise(function (resolve, reject) {
            const img = new Image();
            img.onload = function () {
                const width = img.width;
                const height = img.height;
                resolve({
                    img,
                    src,
                    width,
                    height
                });
            };
            img.onerror = function (event) {
                reject(event);
            };
            img.src = src;
        })
    }

    Promise.all([loadedImage('img/1.jpg'), loadedImage('img/2.jpg')]).then(([res1, res2]) => {
        const width = res1.width;
        const height = res1.height + res2.height;

        agreementCanvas.width = width;
        agreementCanvas.height = height;

        agrContext.drawImage(res1.img, 0, 0, res1.width, res1.height);
        agrContext.drawImage(res2.img, 0, res1.height, res2.width, res2.height);

        topSignImageData = agrContext.getImageData(...topSignPosition);
        noImageData = agrContext.getImageData(...noPosition);
        phoneImageData = agrContext.getImageData(...phonePosition);
        cardImageData = agrContext.getImageData(...cardPosition);
        signImageData = agrContext.getImageData(...signPosition);


        // 绘制身份证号码
        noContext.clearRect(0, 0, noCanvas.width * devicePixelRatio, noCanvas.height * devicePixelRatio);
        noContext.font = 24 * devicePixelRatio + 'px sans-self';
        noContext.fillStyle = '#000000';
        noContext.fillText(s, 0, 23 * devicePixelRatio, noPosition[2] * devicePixelRatio);

        agrContext.putImageData(noImageData, noPosition[0], noPosition[1]);
        agrContext.drawImage(noCanvas, ...noPosition);
    }).catch(err => {
        console.log(err);
        alert('图片加载失败');
    });


    function bindDrawEvent(canvas, context) {
        let drawFlag = false;
        context.strokeStyle = '#000000';
        context.lineWidth = 2 * devicePixelRatio;
        context.lineCap = 'round';

        function devicePixelRatioCompute(number) {
            return number * canvas.width / offsetWidth;
        }

        let offsetWidth = 0;
        let offsetHeight = 0;
        let offsetLeft = 0;
        let offsetTop = 0;

        function eventStart(event) {
            event.preventDefault();

            const clientRect = canvas.getBoundingClientRect();
            offsetLeft = clientRect.left;
            offsetTop = clientRect.top;
            offsetWidth = clientRect.width;
            offsetHeight = clientRect.height;

            let x = 0;
            let y = 0;

            if (event.type === 'mousedown') {
                x = event.clientX;
                y = event.clientY;
            } else if (event.type === 'touchstart') {
                x = event.touches[0].clientX;
                y = event.touches[0].clientY;
            }

            drawFlag = true;
            context.beginPath();
            context.moveTo(devicePixelRatioCompute(x - offsetLeft), devicePixelRatioCompute(y - offsetTop));
        }

        function eventMove(event) {
            if (drawFlag) {
                event.preventDefault();

                let x = 0;
                let y = 0;

                if (event.type === 'mousemove') {
                    x = event.clientX;
                    y = event.clientY;
                } else if (event.type === 'touchmove') {
                    x = event.touches[0].clientX;
                    y = event.touches[0].clientY;
                }

                context.lineTo(devicePixelRatioCompute(x - offsetLeft), devicePixelRatioCompute(y - offsetTop));
                context.stroke();
            }
        }

        function eventEnd(event) {
            if (drawFlag) {
                context.closePath();
                drawFlag = false;
            }
        }

        canvas.addEventListener('mousedown', eventStart, false);

        canvas.addEventListener('mousemove', eventMove, false);

        canvas.addEventListener('mouseup', eventEnd);

        canvas.addEventListener('mouseout', eventEnd);

        canvas.addEventListener('touchstart', eventStart);

        canvas.addEventListener('touchmove', eventMove);

        canvas.addEventListener('touchend', eventEnd);

        canvas.addEventListener('touchcancel', eventEnd);
    }

    bindDrawEvent(signCanvas, signContext);

    btnDownload.addEventListener('click', () => {
        const base64 = agreementCanvas.toDataURL('image/png');
        const blob = dataURL2blob(base64);
        const src = URL.createObjectURL(blob);

        downloadImg.src = base64;
        noDownload.classList.remove('hide');
        pageMain.classList.add('hide');
        window.scrollTo(0, 0);

        setTimeout(function () {
            alert('长按图片保存或发送');
        }, 1000);


        /*if(supperDownload) {
            downloadLink.href = src;
            downloadLink.click();

            setTimeout(function() {
                URL.revokeObjectURL(src);
            }, 10);
        } else {
            downloadImg.src = base64;
            noDownload.classList.remove('hide');
            pageMain.classList.add('hide');
        }*/
    });
}

(function() {
    if (s) {
        s = decode(s);

        init();
    } else {
        alert('页面地址错误');
    }
}());