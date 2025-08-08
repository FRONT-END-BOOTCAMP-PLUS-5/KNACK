export class Address {
    constructor(
        public readonly id: number,
        public readonly userId: string,
        public name: string,
        public phone: string | null,
        public zipCode: string,
        public detail: string | null,
        public main: string,
        public message: string | null,
        public isDefault: boolean,
    ) { }
}