import EventEmitter = require("events");

export class Timeout {
    ticks: number;
    readonly interveral: number;
    private timerActive: boolean = false;
    private paused: boolean = false;
    private readonly intialTicks: number;
    eventEmitter = new EventEmitter();
    private timer: NodeJS.Timeout;

    constructor (interval:number, ticks:number) {
        this.interveral = interval;
        this.ticks = ticks;
        this.intialTicks = ticks;
    }

    public start() {
        //This is here to stop the multiple time 
        if(this.timerActive == false) {
            this.timerActive = true;
            this.timer = setInterval(() => {
                this.ticks--;
                if(this.ticks == 0) {
                    clearInterval(this.timer);
                    this.eventEmitter.emit("finished");
                }
                console.log(this.ticks);
            }, this.interveral);
        }
        else {
            this.eventEmitter.emit("started");
        }
    }

    public stop() {
        if(this.timerActive == true) {
            this.timerActive = false;
            clearTimeout(this.timer);
            this.ticks = this.intialTicks;
            this.timeLeft();
            this.eventEmitter.emit("stopped");
        }
    }

    public pause() {
        if(this.timerActive == true) {
            this.timerActive = false;
            clearTimeout(this.timer);
            this.eventEmitter.emit("paused");
        }
    }
    
    //TODO, lol I forgot about this
    addTime() {

    }

    public restart() {
        this.stop();
        this.start();
        this.eventEmitter.emit("restarted");
    }

    public timeLeft() {
        console.log("There is " + ((this.interveral * this.ticks) / 1000) + " seconds left");
    }


    public unpause() {
        this.start();
        this.eventEmitter.emit("unpaused");
    }

    public get timerStatus() {
        return this.timerActive;
    }
}