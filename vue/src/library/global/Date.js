export default new class DateTime {
    date = new Date();
    /*
        diff       計算日期(當日日期-傳入天數)                          return Date Object
        diff_f     計算日期(當日日期-傳入天數)                          return DateTime String
        diff_week  計算星期(該星期-傳入周數)                            return Javascript Object
        diff_date  日期加減(傳入天數-傳入天數)                          return DateTime String
        diff_month 月份加減(該月份-傳入月份)                            return Javascript Object
        range      取日期區間中所有日期(該月份-傳入月份)                 return Javascript Array
        de_format  DateTime String轉Date Object(傳入DateTime String)   return Date Object
        format     Date Object轉DateTime String(傳入Date Object)       return DateTime String
        format     Date Object轉DateTime String(傳入Date Object)       return DateTime String
        month      取得當天的月份(void)                                 return Javascript String
        between    判斷傳入日期是否再自定義的區間當中(欲判斷日期, 起, 訖)  return boolean
    */

    Simplify(dateTimeString) {
        dateTimeString = dateTimeString.replace(
            `${new Date().getFullYear()}-`,
            ""
        );
        dateTimeString = dateTimeString.replace("-", "/");
        return dateTimeString;
    }

    proccessTimeToSimple(dateTimeString) {
        if (dateTimeString.length > 20){
            dateTimeString = this.Simplify(dateTimeString)
            dateTimeString = dateTimeString.replace("&nbsp;", "");
            dateTimeString = dateTimeString.replace(" ", "<br/>");
        }
        return dateTimeString;
    }
    diff_f(offset) {
        let dd = new Date();
        dd = new Date(this.date.getTime() - (offset * 24 * 3600 * 1000));
        return `${dd.getFullYear()}-${dd.getMonth() + 1 > 9 ? dd.getMonth() + 1 : `0${dd.getMonth() + 1}`}-${dd.getDate() >= 10 ? dd.getDate() : `0${dd.getDate()}`}`;
    }
    diff(offset) {
        let dd = new Date();
        dd = new Date(this.date.getTime() - (offset * 24 * 3600 * 1000));
        return dd;
    }
    diff_week(offset) {
        let today = this.date.getDay();
        let start_week = (today * 24 * 3600 * 1000);
        let end_week = ((6 - today) * 24 * 3600 * 1000);
        let start = new Date((this.date.getTime() - start_week)).getTime() - (7 * offset * 24 * 3600 * 1000);
        let end = new Date(this.date.getTime() + end_week).getTime() - (7 * offset * 24 * 3600 * 1000);
        return {
            start: this.format(start),
            end: this.format(end),
            today: this.format(this.date.getTime())
        };
    }
    diff_date(date, offset) {
        let dd = new Date(date);
        dd = new Date(dd.getTime() - (offset * 24 * 3600 * 1000));
        return `${dd.getFullYear()}-${dd.getMonth() + 1 > 9 ? dd.getMonth() + 1 : `0${dd.getMonth() + 1}`}-${dd.getDate() >= 10 ? dd.getDate() : `0${dd.getDate()}`}`;
    }
    diff_month(offset = 0) {
        let year = Number(this.date.getFullYear());
        let next_year;
        let next_month = (Number(this.month()) + 1) - offset;
        let this_month = (Number(this.month())) - offset;
        if (this_month <= 0 || next_month <= 0) {
            do {
                next_month += 12;
                this_month += 12;
                year--;
            } while (this_month <= 0);
        }
        next_year = year;
        if (next_month > 12 || this_month > 12) {
            next_month -= next_month > 12 ? 12 : 0;
            this_month -= this_month > 12 ? 12 : 0;
            next_year++;
        }
        next_month = next_month < 10 ? `0${next_month}` : next_month;
        this_month = this_month < 10 ? `0${this_month}` : this_month;
        let end = this.diff_date(`${next_year}-${next_month}-01`, 1);
        let start = `${year}-${this_month}-01`;
        return { start, end };
    }
    range(start, end) {
        let date_all = [];
        let i = 0;
        let startTime = this.de_format(start);
        let endTime = this.de_format(end);
        while ((endTime.getTime() - startTime.getTime()) >= 0) {
            let year = startTime.getFullYear();
            let month = (startTime.getMonth() + 1).toString().length == 1 ? "0" + (startTime.getMonth() + 1).toString() : (startTime.getMonth() + 1).toString();
            let day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
            date_all[i] = year + "-" + month + "-" + day;
            startTime.setDate(startTime.getDate() + 1);
            i += 1;
        }
        return date_all;
    }
    de_format(datestr) {
        let temp = datestr.split("-");
        let new_date = new Date(temp[0], temp[1] - 1, temp[2]);
        return new_date;
    }
    format(object) {
        let obj = new Date(object);
        return `${obj.getFullYear()}-${obj.getMonth() + 1 > 9 ? obj.getMonth() + 1 : `0${obj.getMonth() + 1}`}-${obj.getDate() > 9 ? obj.getDate() : `0${obj.getDate()}`}`;
    }
    month() {
        return this.date.getMonth() + 1 <= 9 ? `0${this.date.getMonth() + 1}` : this.date.getMonth() + 1 > 12 ? '01' : this.date.getDate();
    }
    between(target, start, end) {
        target = new Date(this.format(new Date(target).getTime())).getTime();
        start = new Date(this.format(new Date(start).getTime())).getTime();
        end = new Date(this.format(new Date(end).getTime())).getTime();
        if (Number(target) >= Number(start) && Number(target) <= Number(end)) return true;
        else return false;
    }
}
