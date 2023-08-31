export class Sound {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();

        this.loopTime = 0.016;
        this.loopMaxTime = 4;
        this.notesPeerLoop = 32;
        this.currentTime = this.loopMaxTime / this.notesPeerLoop;

        this.musicBassNote = 0;
        this.musicMelodyNote = 0;

        this.isSoundOn = true;
        this.isSoundInitialized = false;
    }

    muteMusic() {
        this.isSoundOn = !this.isSoundOn;
    }

    initSound() {
        this.isSoundInitialized = true;
        this.context.resume();
    }

    clickSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 174.6, 0.14, 0, 0.2);
        }
    }

    enemyTakeDmgSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 32.70, 0.12, 0, 0.1);
            this.playSound("square", 36.71, 0.12, 0.1, 0.2);
            this.playSound("square", 16.35, 0.14, 0.2, 0.2);
        }
    }

    playerTakeDmgSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 130.81, 0.14, 0, 0.1);
            this.playSound("square", 146.83, 0.14, 0.1, 0.2);
            this.playSound("square", 65.41, 0.16, 0.2, 0.2);
        }
    }

    spawnSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 293.7, 0.1, 0, 0.2);
        }
    }

    deadSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 18.35, 0.1, 0, 0.1);
            this.playSound("square", 36.71, 0.1, 0.1, 0.2);
            this.playSound("square", 73.42, 0.1, 0.2, 0.2);
        }
    }

    pickItem() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 932.3, 0.1, 0, 0.1);
            this.playSound("square", 1865, 0.1, 0.1, 0.2);
        }
    }

    atkSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("sine", 82.41, 0.4, 0, 0.2);
        }
    }

    walkSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("triangle", 110, 0.05, 0, 0.1);
        }
    }

    openDoorSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("triangle", 293.66, 0.05, 0, 0.1);
            this.playSound("triangle", 146.83, 0.05, 0.1, 0.2);
        }
    }



    playOverSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 32.70, 0.3, 0, 0.1);
            this.playSound("square", 36.71, 0.2, 0.1, 0.2);
            this.playSound("square", 16.35, 0.3, 0.2, 0.1);
        }
    }

    playMusic() {
        if (this.isSoundOn && this.isSoundInitialized) {
            if (this.currentTime >= (this.loopMaxTime / this.notesPeerLoop)) {

                this.playSound("triangle", mB[this.musicBassNote], 0.5, 0, 0.4);
                this.musicBassNote++;
                if (this.musicBassNote >= mB.length) {
                    this.musicBassNote = 0;
                }
                this.playSound("square", mM[this.musicMelodyNote], 0.08, 0, 0.4);
                this.musicMelodyNote++;
                if (this.musicMelodyNote >= mM.length) {
                    this.musicMelodyNote = 0;
                }

                this.currentTime = 0;
            } else {
                this.currentTime = this.currentTime + this.loopTime;
            }
        }
    }

    playSound(type, value, volume, start, end) {
        const o = this.context.createOscillator();
        const g = this.context.createGain();
        o.type = type;
        o.frequency.value = value;

        g.gain.setValueAtTime(volume, this.context.currentTime);
        g.gain.linearRampToValueAtTime(0.00001, this.context.currentTime + end);

        o.connect(g);
        g.connect(this.context.destination);
        o.start(start);
        o.stop(this.context.currentTime + end);
    }
}

const mB = [
    null, null, null, null, 73.42, null, 65.41, null,
    73.42, null, null, null, null, null, null, null,
    73.42, null, null, null, null, null, null, null,
    65.41, null, null, null, null, null, null, null,
    73.42, null, null, null, null, null, null, null,
    73.42, null, null, null, null, null, null, null,
    65.41, null, null, null, null, null, null, null,
    73.42, null, null, null, null, null, null, null,
    87.31, null, null, null, null, null, null, null,
    87.31, null, null, null, null, null, null, null
];

// Saltarello in Dm - Medieval Italian Dance
const mM = [
    329.63, null, null, null, 349.23, null, 392, null,
    440, null, 146.83, null, 440, null, 146.83, null,
    440, null, 146.83, null, 440, null, null, null,
    392, null, 329.63, 349.23, 392, 349.23, 329.63, 349.23,
    146.83, null, 440, null, 146.83, null, null, null,
    146.83, null, 329.63, null, 349.23, 329.63, 349.23, 146.83,
    261.63, null, 392, null, 261.63, null, null, null,
    146.83, null, null, null, 392, null, null, 349.23,
    329.63, 349.23, 329.63, 293.66, 329.63, 293.66, 261.63, 293.66,
    329.63, null, null, null, 246.94, null, null, null
];