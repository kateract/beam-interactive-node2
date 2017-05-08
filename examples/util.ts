import {
    IButtonData,
    IControlData,
} from '../lib';

export interface INameFunc {
    (index: number): string;
}

function defaultNameFunc(index: number): string {
    return `Button ${index}`;
}

export function makeButtons(amount: number, nameFunc: INameFunc = defaultNameFunc): IControlData[] {
    const controls: IButtonData[] = [];
    const size = 10;
    for (let i = 0; i < amount; i++) {
        controls.push({
            controlID: `${i}`,
            kind: 'button',
            text: nameFunc(i),
            cost: 1,
            position: [
                   {
                       size: 'large',
                       width: size,
                       height: size / 2,
                       x: i * size,
                       y: 1,
                   },
                   {
                       size: 'small',
                       width: size,
                       height: size / 2,
                       x: i * size,
                       y: 1,
                   },
                   {
                       size: 'medium',
                       width: size,
                       height: size,
                       x: i * size,
                       y: 1,
                   },
               ],
            },
        );
    }
    return controls;
}
