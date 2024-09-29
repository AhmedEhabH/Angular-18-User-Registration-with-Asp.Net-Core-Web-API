import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name : 'firstKey', standalone : true})
export class FirstKeyPipe implements PipeTransform {

    transform(value: any): string|null {
        const key = Object.keys(value);
        if (key && key.length)
            return key[0];
        
        return null;
    }
}
