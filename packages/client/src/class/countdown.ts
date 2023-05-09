import { deleteResult } from "@/util/handleForm";

export class Countdown {
	countdown: {
		days: HTMLSpanElement;
		hours: HTMLSpanElement;
		minutes: HTMLSpanElement;
	};
	values: {
		days: number;
		hours: number;
		minutes: number;
	};
	interval: NodeJS.Timer | undefined = undefined;
	constructor(element: HTMLSpanElement) {
		this.countdown = {
			days: element.querySelector(".days") as HTMLSpanElement,
			hours: element.querySelector(".hours") as HTMLSpanElement,
			minutes: element.querySelector(".minutes") as HTMLSpanElement
		};

		//if (!this.elements.countdown || !this.elements.days || !this.elements.hours || !this.elements.minutes) return;

		this.values = {
			days: Number(this.countdown.days.style.getPropertyValue("--value")),
			hours: Number(this.countdown.hours.style.getPropertyValue("--value")),
			minutes: Number(this.countdown.minutes.style.getPropertyValue("--value"))
		};
	}
	start() {
		if (!this.countdown.days || !this.countdown.hours || !this.countdown.minutes) return;
		setTimeout(async () => await this.check(), 1000);
		this.interval = setInterval(() => {
			if (this.values.hours === 0 && this.values.minutes === 0) {
				this.check();
				this.values.days--;
				this.countdown.days.style.setProperty("--value", this.values.days.toString());
				this.values.hours = 23;
				this.values.minutes = 59;
				return;
			}
			if (this.values.minutes === 0) {
				this.check();
				this.values.hours--;
				this.countdown.hours.style.setProperty("--value", this.values.hours.toString());
				this.values.minutes = 59;
				return;
			}
			this.values.minutes--;
			this.countdown.minutes.style.setProperty("--value", this.values.minutes.toString());
			this.check();
		}, 1000 * 60);
	}
	private async check() {
		if (this.values.days <= 0 && this.values.hours <= 0 && this.values.minutes <= 0) {
			this.stop();
			const getParentElement = this.countdown.days.parentElement as HTMLElement;
			await deleteResult(getParentElement);
		}
	}
	private stop() {
		clearInterval(this.interval);
	}
}
