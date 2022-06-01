export interface Platform {
    play(song: string);
}

export abstract class Platform {
    protected readonly name: string;
    
    constructor(parameters) {

    }
}