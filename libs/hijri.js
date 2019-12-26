module.exports.hijri    = () => {

    var eventsIslamic   = new Array()

    eventsIslamic[0]    = [
        {
            date: 1,
            name: 'Tahun Baru Hijriah'
        },
        {
            date: 10,
            name: 'Hari Asyura'
        }
    ];

    eventsIslamic[1]    = [
        {
            date: 27,
            name: 'Hijrah dari Mekkah ke Madinah'
        }
    ];

    eventsIslamic[2]    = [
        {
            date: 12,
            name: 'Maulid Nabi Muhammad SAW'
        }
    ];

    eventsIslamic[6]    = [
        {
            date: 27,
            name: "Isra' Mi'raj"
        }
    ]

    eventsIslamic[8]    = [
        {
            date: 1,
            name: 'Puasa Ramadhan'
        },
        {
            date: 17,
            name: "Nuzulul Qur'an"
        },
        {
            date: 27,
            name: 'Lailatul Qadar'
        }
    ]

    eventsIslamic[9]    = [
        {
            date: 1,
            name: "Idul Fitri"
        }
    ];

    eventsIslamic[11]   = [
        {
            date: 8,
            name: "Hari Tarwiyah"
        },
        {
            date: 9,
            name: "Wukuf"
        },
        {
            date: 10,
            name: "Idul Adha"
        },
        {
            date: 11,
            name: "Hari Tasyriq"
        },
        {
            date: 12,
            name: "Hari Tasyriq"
        },
        {
            date: 13,
            name: "Hari Tasyriq"
        }
    ];

    return {
        gmod: function(n,m){
            return ((n%m)+m)%m;
        },

        kuwaiticalendar: function(date, adjust){
            var adjustmili, todaymili
            var today   = new Date()
            if(date != undefined || date != null) {
                today   = new Date(date)
            }
            if(adjust) {
                adjustmili = 1000*60*60*24*adjust; 
                todaymili = today.getTime()+adjustmili;
                today = new Date(todaymili);
            }
            var day = today.getDate();
            var month = today.getMonth();
            var year = today.getFullYear();
            var m = month+1;
            var y = year;
            if(m<3) {
                y -= 1;
                m += 12;
            }
        
            var a = Math.floor(y/100.);
            var b = 2-a+Math.floor(a/4.);
            if(y<1583) b = 0;
            if(y==1582) {
                if(m>10)  b = -10;
                if(m==10) {
                    b = 0;
                    if(day>4) b = -10;
                }
            }
        
            var jd = Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+day+b-1524;
        
            b = 0;
            if(jd>2299160){
                a = Math.floor((jd-1867216.25)/36524.25);
                b = 1+a-Math.floor(a/4.);
            }
            var bb = jd+b+1524;
            var cc = Math.floor((bb-122.1)/365.25);
            var dd = Math.floor(365.25*cc);
            var ee = Math.floor((bb-dd)/30.6001);
            day =(bb-dd)-Math.floor(30.6001*ee);
            month = ee-1;
            if(ee>13) {
                cc += 1;
                month = ee-13;
            }
            year = cc-4716;
        
            var wd
            if(adjust) {
                wd = this.gmod(jd+1-adjust,7)+1;
            } else {
                wd = this.gmod(jd+1,7)+1;
            }
        
            var iyear = 10631./30.;
            var epochastro = 1948084;
            // eslint-disable-next-line no-unused-vars
            var epochcivil = 1948085;
        
            var shift1 = 8.01/60.;
            
            var z = jd-epochastro;
            var cyc = Math.floor(z/10631.);
            z = z-10631*cyc;
            var j = Math.floor((z-shift1)/iyear);
            var iy = 30*cyc+j;
            z = z-Math.floor(j*iyear+shift1);
            var im = Math.floor((z+28.5001)/29.5);
            if(im==13) im = 12;
            var id = z-Math.floor(29.5001*im-29);
            
            var events  = new Array()
            for(const [key, val] of Object.entries(eventsIslamic)) {
                if(key == (im -1)) {
                    for(let uu in val) {
                        if(val[uu].date == id) {
                            events.push(val[uu])
                        }
                    }
                }
            }
        
            var myRes = new Array(8);
        
            myRes[0] = day; //calculated day (CE)
            myRes[1] = month-1; //calculated month (CE)
            myRes[2] = year; //calculated year (CE)
            myRes[3] = jd-1; //julian day number
            myRes[4] = wd-1; //weekday number
            myRes[5] = id; //islamic date
            myRes[6] = im-1; //islamic month
            myRes[7] = iy; //islamic year
        
            return {
                date: myRes,
                events: events
            };
        },
        
        // eslint-disable-next-line no-unused-vars
        writeIslamicDate: function(date, adjustment) {
            var wdNames = new Array(
                "Minggu","Senin","Selasa",
                "Rabu","Kamis","Jum'at",
                "Sabtu"
            );

            var iMonthNames = new Array(
                "Muharram", "Safar", "Rabi'ul Awal", "Rabi'ul Akhir",
                "Jumadal Awal", "Jumadal Akhir", "Rajab","Sya'ban",
                "Ramadhan", "Syawwal", "Dzulkaidah", "Dzulhijjah"
            );
            var iDate = this.kuwaiticalendar(date, adjustment);
            var outputIslamicDate = iDate.date[5] + " " + iMonthNames[iDate.date[6]] + " " + iDate.date[7];
            return {
                day: wdNames[iDate.date[4]],
                month: {
                    number: iDate.date[6] + 1,
                    name: iMonthNames[iDate.date[6]]
                },
                year: iDate.date[7],
                date: iDate.date[5],
                full: outputIslamicDate,
                events: iDate.events
            };
        }
    }
}