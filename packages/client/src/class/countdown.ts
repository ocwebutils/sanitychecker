import { deleteResult } from "@/util/handleForm";

export class Countdown {
	elements: {
		countdown: HTMLSpanElement;
		hours: HTMLSpanElement;
		minutes: HTMLSpanElement;
	};
	values: {
		hours: number;
		minutes: number;
	};
	interval: NodeJS.Timer;
	constructor(element) {
		this.elements = {
			countdown: element,
			hours: element.querySelector(".hours"),
			minutes: element.querySelector(".minutes")
		};
		this.values = {
			hours: Number(this.elements.hours.style.getPropertyValue("--value")),
			minutes: Number(this.elements.minutes.style.getPropertyValue("--value"))
		};
		this.interval = null;
	}
	start() {
		setTimeout(async () => await this.check(), 1000);
		this.interval = setInterval(() => {
			if (this.values.minutes === 0) {
				this.values.hours--;
				this.elements.hours.style.setProperty("--value", this.values.hours.toString());
				this.values.minutes = 59;
				this.check();
				return;
			}
			this.values.minutes--;
			this.elements.minutes.style.setProperty("--value", this.values.minutes.toString());
			this.check();
		}, 1000 * 60);
	}
	private async check() {
		if (this.values.hours <= 0 && this.values.minutes <= 0) {
			this.stop();
			await deleteResult(this.elements.countdown);
		}
	}
	private stop() {
		clearInterval(this.interval);
	}
}
