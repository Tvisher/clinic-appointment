'use strict';
import Swiper, {
    Navigation,
    Manipulation
} from 'swiper';
import AirDatepicker from 'air-datepicker';
import localeEn from 'air-datepicker/locale/en.js';

let datapicerCounter = 0;
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
        if (datapicerCounter > 0) {
            datepicker.$el.setAttribute('from-date', formattedDate[0]);
            datepicker.$el.setAttribute('to-date', formattedDate[1]);
            datapicerCounter = 0;
        } else {
            datapicerCounter++;
        }
    }
});


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


document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('.show-details')) {
        const parentElem = target.closest('.shedule-body__time');
        parentElem.classList.toggle('show');
    }
})