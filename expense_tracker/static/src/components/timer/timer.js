import { Component, computed, onMounted, onWillUnmount, signal } from "@odoo/owl";

export class Time extends Component {
    static template = "expense_tracker.time";

    setup() {
        const start = new Date();
        // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/reactivity.html
        this.elapsedSeconds = signal(Math.floor((Date.now() - start) / 1000));

        // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/reactivity.html
        // Doc: https://odoo.github.io/owl/documentation/v3/owl/reference/computed_values.html
        this.time = computed(() => {
            let delta = this.elapsedSeconds();
            const days = Math.floor(delta / 86400);
            delta -= days * 86400;
            const hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;
            const minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;
            const seconds = Math.floor(delta) % 60;
            return { days, hours, minutes, seconds };
        });

        let intervalId;
        onMounted(() => {
            intervalId = setInterval(() => {
                this.elapsedSeconds.set(this.elapsedSeconds() + 1);
            }, 1000);
        });
        onWillUnmount(() => clearInterval(intervalId));
    }

    interval(date1, date2) {
        let delta = Math.abs(date1 - date2) / 1000;

        const days = Math.floor(delta / 86400);
        delta -= days * 86400;

        // calculate (and subtract) whole hours
        const hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        // calculate (and subtract) whole minutes
        const minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        const seconds = Math.floor(delta) % 60;

        return {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        };
    }

    updateTime() {
        let seconds = this.state.time.seconds;
        let minutes = this.state.time.minutes;
        let hours = this.state.time.hours;
        let days = this.state.time.days;

        seconds += 1;
        if (seconds === 60) {
            seconds = 0;
            minutes += 1;
        }
        if (minutes === 60) {
            minutes = 0;
            hours += 1;
        }
        if (hours === 24) {
            hours = 0;
            days += 1;
        }

        this.state.time.seconds = seconds;
        this.state.time.minutes = minutes;
        this.state.time.hours = hours;
        this.state.time.days = days;
    }
}
