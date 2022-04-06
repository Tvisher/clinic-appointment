'use strict';

import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en.js';

// Счётчик календаря для корректного выбора диапазона дат.
let datapickerCounter = 0;
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
            datepicker.$el.parentNode.querySelector('.date-range__select-text').innerHTML = `${formattedDate[0]} - ${formattedDate[1]}`;
            datapickerCounter = 0;
        } else {
            datapickerCounter++;
        }
    }
});


// Включение и выключение зажима модального окна в календаре
function checkWindowSize(e) {
    const windowInnerWidth = window.innerWidth;
    if (windowInnerWidth <= 576) {
        dateRangeDatapicker.update({ isMobile: true });
    } else {
        dateRangeDatapicker.update({ isMobile: false });
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
        // parentElem.classList.toggle('show');
        vanilaToggle(parentElem)
    }
    // Открыть модалку с отменой записи пациента
    if (target.closest('[data-cancel-appointment]')) {
        document.querySelector('[data-cancel-appointment-modal]').classList.add('show');
    }
    //Закрыть модалку при нажатии на кнопку "no", крестик или фон модалки
    if (target.closest('.cancel__btn') || target.closest('[data-close-modal]') || (target.closest('.modal__wrapper.show') && !target.closest('.appointment-cancel-modal'))) {
        document.querySelector('[data-cancel-appointment-modal]').classList.remove('show');
    }
});



// Аналог slidetoggle на чистом js
function vanilaToggle(toggleContent) {
    let elemHeight = window.innerWidth < 576 ? "45px" : '56px';

    if (!toggleContent.classList.contains('show')) {
        toggleContent.classList.add('show');
        toggleContent.style.height = 'auto';

        let height = toggleContent.clientHeight + 'px';
        toggleContent.style.height = elemHeight;

        setTimeout(function () {
            toggleContent.style.height = height;
        }, 0);
    } else {
        toggleContent.style.height = elemHeight;
        toggleContent.addEventListener('transitionend',
            function () {
                toggleContent.classList.remove('show');
            }, {
            once: true
        });
    }
}