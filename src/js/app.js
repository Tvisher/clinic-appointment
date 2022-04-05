'use strict';
import Swiper, {
    Navigation,
    Manipulation
} from 'swiper';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en.js';

let datapicerCounter = 0;
window.stepOneDatapicker = new AirDatepicker('#date-range__datapicker', {
    autoClose: true,
    position: 'bottom right',
    //Английская локализация
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
        if (datapicerCounter > 0) {
            datepicker.$el.setAttribute('from-value', formattedDate[0]);
            datepicker.$el.setAttribute('to-value', formattedDate[1]);
            datapicerCounter = 0;
        } else {
            datapicerCounter++;
        }
    }
});


document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('.show-details')) {
        const parentElem = target.closest('.shedule-body__time');
        parentElem.classList.toggle('show');
    }
})