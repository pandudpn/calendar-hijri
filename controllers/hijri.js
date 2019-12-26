const express   = require('express');
const router    = express.Router();
const response  = require('../res');
const hijriah   = require("../libs/hijri")

router.post('/', (req, res) => {
    const hijri = hijriah.hijri()

    let year    = new Date().getFullYear()

    var data    = new Array()

    for(let i = 1; i <= 12; i++) { /* month 1 - 12 */
        let lastDay = new Date(year, i, 0)
        var event   = new Array()
        var calendar= new Array()
        var senin   = new Array()
        var kamis   = new Array()

        let newMonth = null, oldMonth = null

        for(let j = 1; j <= lastDay.getDate(); j++) { /* from 1 (first day of month) untill last day each month */
            let hijriDate   = hijri.writeIslamicDate(`${year}-${i}-${j}`)
            let abc         = (j == 1) ? j : (j - 1)
            let beforeHDate = hijri.writeIslamicDate(`${year}-${i}-${abc}`)
            let date        = new Date(`${year}-${i}-${j}`)

            if(beforeHDate.month.number != hijriDate.month.number) {
                if(newMonth == null) {
                    newMonth    = hijriDate.month.name + ' ' + hijriDate.year
                    oldMonth    = beforeHDate.month.name + ' ' + beforeHDate.year
                }
            }

            calendar.push({
                day: hijriDate.day,
                date: `${j} ${bulan(i)} ${year}`,
                hijri: hijriDate.full
            })

            if(parseInt(date.getDay()) === 1) {
                senin.push(j)
            }
            if(parseInt(date.getDay()) === 4) {
                kamis.push(j)
            }

            if(hijriDate.events.length > 0) {
                for(let h in hijriDate.events) {
                    event.push({
                        id: null,
                        date: hijriDate.events[h].date,
                        name: hijriDate.events[h].name,
                        type: "islam day"
                    })
                }
            }
        }

        data.push({
            date: `${bulan(i)} ${year}`,
            hijri: `${oldMonth} - ${newMonth}`,
            schedule: {
                senin: senin,
                kamis: kamis,
                events: event
            },
            calendar: calendar
        })
    }

    response.ok(res, data);
})

const bulan = (month) => {
    switch(month) {
        case 1:
            return 'Januari'
        case 2:
            return 'Febuari'
        case 3:
            return 'Maret'
        case 4:
            return 'April'
        case 5:
            return 'Mei'
        case 6:
            return 'Juni'
        case 7:
            return 'Juli'
        case 8:
            return 'Agustus'
        case 9:
            return 'September'
        case 10:
            return 'Oktober'
        case 11:
            return 'November'
        case 12:
            return 'Desember'
        default:
            return null
    }
}

module.exports  = router