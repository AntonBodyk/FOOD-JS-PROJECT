document.addEventListener('DOMContentLoaded', () =>{
//--------------------------HEADER-FUNCTIONAL-TABS
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabContent = document.querySelectorAll('.tabcontent'),
          tabParent = document.querySelector('.tabheader__items');

    function headTabContent(){
        tabContent.forEach(item =>{
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item =>{
            item.classList.remove('tabheader__item_active');
        });

        
    }
    headTabContent();

    function showTabContent(i = 0){
        tabContent[i].classList.add('show', 'fade');
        tabContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    showTabContent();

    tabParent.addEventListener('click', (event) =>{
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) =>{
                if(target === item){
                    headTabContent();
                    showTabContent(i);
                }
            });
        }
    });


//-----------------------PROJECT-TIMER
const deadline = '2022-10-20';

function getTime(endtime){
    let days, hours,minutes,seconds;

    const t = Date.parse(endtime) - Date.parse(new Date());

    if(t <= 0){
        days = 0;
        hours = 0;
        minutes = 0;
        seconds = 0;
    }else{
        days = Math.floor((t / (1000 * 60 * 60 * 24))),
        hours = Math.floor((t / (1000 * 60 * 60) % 24)),
        minutes = Math.floor((t / (1000 * 60) % 60)),
        seconds = Math.floor((t / 1000) % 60);
    }
        return{
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
}
function getZero(num){
    if(num >= 0 && num < 10){
        return '0' + num;
    }else{
        return num;
    }
}
function setClock(selector, endtime){
    const timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);

    function updateClock(){
        const t = getTime(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

        if(t.total <= 0){
            clearInterval(timeInterval);
        }
    }
    updateClock();
}
setClock('.timer', deadline);

//-----------------------PROJECT-MODAL-WINDOW
const modalTrigger = document.querySelectorAll('[data-modal]'),
      modal = document.querySelector('.modal');

function openModal(){
    modal.classList.add('show');
    modal.classList.remove('hide');
     document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId);
}

modalTrigger.forEach(btn =>{
btn.addEventListener('click', openModal);
});

function closeModal(){
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

modal.addEventListener('click', (e) =>{
    if(e.target === modal || e.target.getAttribute('data-close') == ''){
        closeModal();
    }
});


const modalTimerId = setTimeout(openModal, 20000);

function showModalByScroll(){
    if(window.pageYOffset + document.documentElement.clientHeight >= document.
        documentElement.scrollHeight -1){
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
    }
}
window.addEventListener('scroll', showModalByScroll);

//-------------------CLASESS FOR TABLES 
class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
        this.src = src;
        this.alt = alt;
        this.title = title;
        this.descr = descr;
        this.price = price;
        this.classes = classes;
        this.parent = document.querySelector(parentSelector);
        this.transfer = 27;
        this.changeToUAH(); 
    }

    changeToUAH() {
        this.price = this.price * this.transfer; 
    }

    render() {
        const element = document.createElement('div');

        if(this.classes.length === 0){
            this.classes = 'menu__item';
            element.classList.add(this.classes);
        }else{
            this.classes.forEach(className => element.classList.add(className));
        }
        
        element.innerHTML = `
           <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">????????:</div>
                    <div class="menu__item-total"><span>${this.price}</span> ??????/????????</div>
                </div>
            `;
        this.parent.append(element);
    }
}

 
getResource('http://localhost:3000/menu')
.then(data => {
    data.forEach(({img, altimg, title, descr, price}) => {
        new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    });
});


//---------------------PROJECT-FORMS
const forms = document.querySelectorAll('form');
const message = {
    loading: 'img/form/spinner.svg',
    success: '??????????????! ?????????? ???? ?? ???????? ????????????????',
    failure: '??????-???? ?????????? ???? ??????...'
};

forms.forEach(item => {
    bindPostData(item);
});

const postData = async (url, data) => {
    let res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });

    return await res.json();
};

async function getResource(url) {
    let res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
}

function bindPostData(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let statusMessage = document.createElement('img');
        statusMessage.src = message.loading;
        statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
        `;
        form.insertAdjacentElement('afterend', statusMessage);
    
        const formData = new FormData(form);

        const json = JSON.stringify(Object.fromEntries(formData.entries()));

        postData('http://localhost:3000/requests', json)
        .then(data => {
            console.log(data);
            showThanksModal(message.success);
            statusMessage.remove();
        }).catch(() => {
            showThanksModal(message.failure);
        }).finally(() => {
            form.reset();
        });
    });
}

function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('hide');
    openModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>&times;</div>
            <div class="modal__title">${message}</div>
        </div>
    `;
    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
        thanksModal.remove();
        prevModalDialog.classList.add('show');
        prevModalDialog.classList.remove('hide');
        closeModal();
    }, 4000);
}

//--------------------------------PROJECT-SLIDER
let slideIndex = 1;
const slides = document.querySelectorAll('.offer__slide'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    total = document.querySelector('#total'),
    current = document.querySelector('#current');

showSlides(slideIndex);

if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
} else {
    total.textContent = slides.length;
}

function showSlides(n) {
    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

slides.forEach((item) => item.style.display = 'none');
slides[slideIndex - 1].style.display = 'block'; 
    
if (slides.length < 10) {
        current.textContent =  `0${slideIndex}`;
    }else{
        current.textContent =  slideIndex;
    } 
}

function plusSlides (n) {
    showSlides(slideIndex += n);
}
prev.addEventListener('click', function(){
    plusSlides(-1);
});
next.addEventListener('click', function(){
    plusSlides(1);
});

//---------------------------PROJECT-CALC
const result = document.querySelector('.calculating__result span');
    
let sex, height, weight, age, ratio;

    if(localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    }else{
        sex = 'woman';
        localStorage.setItem('sex', 'woman');
    }

    if(localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    }else{
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

function calcTotal() {
        if(!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        }else{
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

calcTotal();

function initLocalSettings(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(elem => {
        elem.classList.remove(activeClass);
        if (elem.getAttribute('id') === localStorage.getItem('sex')) {
            elem.classList.add(activeClass);
        }
        if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
            elem.classList.add(activeClass);
        }
    });
}

initLocalSettings('#gender div', 'calculating__choose-item_active');
initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });
    }

getStaticInformation('#gender div', 'calculating__choose-item_active');
getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

function getDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = "1px solid red";
            } else {
                input.style.border = 'none';
            }
            switch(input.getAttribute('id')) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');

});
    
