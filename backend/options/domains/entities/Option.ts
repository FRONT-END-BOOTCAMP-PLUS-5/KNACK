export class OptionValue {
  constructor(public readonly id: number, public readonly name: string, public readonly typeId: number) {}
}

export class Option {
  constructor(public readonly id: number, public readonly name: string, public readonly optionValues: OptionValue[]) {}
}
