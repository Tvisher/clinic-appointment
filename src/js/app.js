'use strict';

import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en.js';

//глобальное обьявление тултипов
import tippy from 'tippy.js';
window.tippy = tippy;

// Счётчик календаря для корректного выбора диапазона дат.
let datapickerCounter = 0;
const dateRangeDatapicker = document.querySelector('#date-range__datapicker');
if (dateRangeDatapicker) {
    window.dateRangeDatapicker = new AirDatepicker('#date-range__datapicker', {
        autoClose: true,
        position: 'bottom right',
        locale: localeEn.default,
        dateFormat: 'MMM dd, yyyy',
        range: true,
        buttons: [
            {
                content(dp) {
                    return 'Today';
                },
                onClick(dp) {
                    dp.selectDate(new Date());
                }
            }
        ],
        onSelect({ date, formattedDate, datepicker }) {
            if (datapickerCounter > 0) {
                datepicker.$el.setAttribute('from-date', formattedDate[0]);
                datepicker.$el.setAttribute('to-date', formattedDate[1]);
                const datapickerTextElem = datepicker.$el.parentNode.querySelector('.date-range__select-text');
                datapickerTextElem.innerHTML = `${formattedDate[0]} - ${formattedDate[1]}`;
                datapickerTextElem.classList.add('show');
                datapickerCounter = 0;
            } else {
                datapickerCounter++;
            }
        }
    });

    document.querySelector('[data-open-calendar]').onclick = (e) => {
        window.dateRangeDatapicker.show()
    }
}


function modalDatapickerInit(datapickerEl) {
    window.modalDatapicker = new AirDatepicker(datapickerEl, {
        autoClose: true,
        position: 'bottom right',
        locale: localeEn.default,
        dateFormat: 'MMMM dd, yyyy',
        isMobile: true,
        buttons: [
            {
                content(dp) {
                    return 'Today';
                },
                onClick(dp) {
                    dp.selectDate(new Date());
                }
            }
        ],
        onSelect({ date, formattedDate, datepicker }) {
            datepicker.$el.parentNode.querySelector('.styles-text').classList.add('fixed');
            const selectedFullDay = date.toLocaleString('en', { "weekday": "long" });
            datepicker.$el.closest('.calendar-field').querySelector('.day-wrapper').style.opacity = 1;
            const dayTextElem = datepicker.$el.closest('.calendar-field').querySelector('.selected-day');
            dayTextElem.innerText = selectedFullDay;
        }
    });
}
modalDatapickerInit('#modal-datapicker');


// Включение и выключение режима модального окна в календаре
function checkWindowSize(e) {
    const windowInnerWidth = window.innerWidth;
    if (windowInnerWidth <= 992) {
        dateRangeDatapicker && window.dateRangeDatapicker.update({ isMobile: true });
    } else {
        dateRangeDatapicker && window.dateRangeDatapicker.update({ isMobile: false });
    }
}
checkWindowSize();
window.addEventListener('resize', checkWindowSize);

// События клика на разные элементы
document.addEventListener('click', (e) => {
    const target = e.target;
    //Показать скрытую информацию о пациенте
    if (target.closest('.show-details')) {
        const parentElem = target.closest('.shedule-body__time');
        vanilaToggle(parentElem, "45px", "56px");
    }

    if (target.closest('[data-working-hours-day]')) {
        if (e.target.nodeName === 'INPUT') {
            e.stopPropagation();
            return;
        }
        const parentElem = target.closest('.working-hours__item');
        vanilaToggle(parentElem, "47px", "64px", e);
    }
    // Открыть модалку с отменой записи пациента
    if (target.closest('[data-cancel-appointment]')) {
        document.querySelector('[data-cancel-appointment-modal]').classList.add('show');
    }
    //Закрыть модалку при нажатии на кнопку "no", крестик или фон модалки
    if (target.closest('.cancel__btn') || target.closest('[data-close-modal]') || (target.closest('.modal__wrapper.show') && !target.closest('.appointment-cancel-modal'))) {
        document.querySelector('[data-cancel-appointment-modal]').classList.remove('show');
    }

    //Скрываем текстовое поле с диапозоном дат при выборе нужного диапозона
    if (target.closest('[data-selected-range]')) {
        let currentTimeRange = target.closest('[data-selected-range]').querySelector('.list-item__name').textContent;
        let textBlock = document.querySelector('.date-range__select-text')
        textBlock.innerText = currentTimeRange;
        textBlock.classList.add('show');
    }
    // Скрываем выпадающее меню при нажатии куда либо
    if (document.querySelector('.date-range__date-list.show')) {
        document.querySelector('.date-range__date-list').classList.remove('show');
        document.querySelector('[data-open-range-date]').classList.remove('show');
        return;
    }
    // Открываем выпадающее меню с диапазонами дат при нажатии на бургер
    if (target.closest('[data-open-range-date]') && !target.closest('[data-open-range-date].show')) {
        target.closest('[data-open-range-date]').classList.toggle('show');
        document.querySelector('.date-range__date-list').classList.toggle('show');
    }

});



// Аналог slidetoggle на чистом js
function vanilaToggle(toggleContent, minMobSize, minPcSize, event) {
    let elemHeight = window.innerWidth < 576 ? minMobSize : minPcSize;

    if (!toggleContent.classList.contains('show') && !toggleContent.classList.contains('down')) {
        toggleContent.classList.add('show');
        toggleContent.style.height = 'auto';

        let height = toggleContent.clientHeight + 'px';
        toggleContent.style.height = elemHeight;

        setTimeout(function () {
            toggleContent.style.height = height;
        }, 0);
    } else {
        toggleContent.style.height = elemHeight;
        toggleContent.classList.add('down');
        toggleContent.addEventListener('transitionend',
            function () {
                toggleContent.classList.remove('down');
                toggleContent.classList.remove('show');
            }, {
            once: true
        });
    }
}

//Анимация инпутов с placeholder выезжающим за пределы поля инпута
const stylinginputs = document.querySelectorAll('[data-styles-field]');
if (stylinginputs) {
    stylinginputs.forEach(input => {
        const inputpParent = input.parentNode;
        const transformtext = inputpParent.querySelector('.styles-text');
        input.addEventListener('focus', (e) => {
            inputpParent.classList.add('focus');
            transformtext && transformtext.classList.add('fixed');

            input.addEventListener('blur', (e) => {
                const inputValue = e.target.value.trim();
                inputpParent.classList.remove('focus');
                if (inputValue.length === 0) {
                    transformtext.classList.remove('fixed');
                }
            }, { once: true });
        });
        //Добавление класса к инпуту если он заполнен
        const inputValue = input.value.trim();
        if (inputValue.length === 0) {
            transformtext.classList.remove('fixed');
        } else {
            transformtext.classList.add('fixed');
        }
    });
}