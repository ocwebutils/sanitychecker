import { deleteResult } from "@/util/handleForm";

export class Countdown {
	elements: {
		countdown: HTMLSpanElement;
		days: HTMLSpanElement;
		hours: HTMLSpanElement;
		minutes: HTMLSpanElement;
	};
	values: {
		days: number;
		hours: number;
		minutes: number;
	};
	interval: NodeJS.Timer;
	constructor(element) {
		this.elements = {
			countdown: element,
			days: element.querySelector(".days"),
			hours: element.querySelector(".hours"),
			minutes: element.querySelector(".minutes")
		};
		this.values = {
			days: Number(this.elements.days.style.getPropertyValue("--value")),
			hours: Number(this.elements.hours.style.getPropertyValue("--value")),
			minutes: Number(this.elements.minutes.style.getPropertyValue("--value"))
		};
		this.interval = null;
	}
	start() {
		setTimeout(async () => await this.check(), 1000);
		this.interval = setInterval(() => {
			if (this.values.hours === 0 && this.values.minutes === 0) {
				this.check();
				this.values.days--;
				this.elements.days.style.setProperty("--value", this.values.days.toString());
				this.values.hours = 23;
				this.values.minutes = 59;
				return;
			}
			if (this.values.minutes === 0) {
				this.check();
				this.values.hours--;
				this.elements.hours.style.setProperty("--value", this.values.hours.toString());
				this.values.minutes = 59;
				return;
			}
			this.values.minutes--;
			this.elements.minutes.style.setProperty("--value", this.values.minutes.toString());
			this.check();
		}, 1000 * 60);
	}
	private async check() {
		if (this.values.days <= 0 && this.values.hours <= 0 && this.values.minutes <= 0) {
			this.stop();
			await deleteResult(this.elements.countdown);
		}
	}
	private stop() {
		clearInterval(this.interval);
	}
}
