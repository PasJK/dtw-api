export class DateUtil {
    private date: Date;
    private options: Intl.DateTimeFormatOptions;

    /**
     * @param {string} dateString The date string to be used for formatting.
     */
    constructor(dateString: string) {
        this.date = new Date(dateString);
        this.options = {
            hour12: false,
            timeZone: "Asia/Bangkok",
        };
    }

    /**
     * @returns {string} The formatted date string in "DD/MM/YYYY" format.
     */
    formatDate(): string {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            ...this.options,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        return formatter.format(this.date);
    }
}
